const P = require("pino");
const qrcode = require("qrcode-terminal");
const makeWASocketModule = require("@whiskeysockets/baileys");
const getRedisClient = require("../config/redis");
const { useRedisAuthState, clearRedisAuthState } = require("./redisAuthState");
const { normalizePhoneForWhatsApp } = require("./whatsapp");

const makeWASocket = makeWASocketModule.default || makeWASocketModule;
const { DisconnectReason } = makeWASocketModule;

const sockets = new Map();
const reconnectTimers = new Map();

const getKeys = (sessionId = "main") => ({
    status: `wa:session:${sessionId}:status`,
    qr: `wa:session:${sessionId}:qr`,
    lastMessage: `wa:session:${sessionId}:last_message`,
});

const buildJid = (phoneNo) => {
    const normalized = normalizePhoneForWhatsApp(phoneNo).replace(/[^0-9]/g, "");

    if (!normalized) {
        throw new Error("Invalid WhatsApp destination number");
    }

    return `${normalized}@s.whatsapp.net`;
};

const setStatus = async (sessionId, data = {}) => {
    const redis = getRedisClient();
    const keys = getKeys(sessionId);

    await redis.hset(keys.status, {
        sessionId,
        updatedAt: new Date().toISOString(),
        ...data,
    });
};

const getSessionStatus = async (sessionId = "main") => {
    const redis = getRedisClient();
    const keys = getKeys(sessionId);
    const status = await redis.hgetall(keys.status);
    const qr = await redis.get(keys.qr);
    const socketState = sockets.get(sessionId);

    return {
        sessionId,
        isSocketReady: Boolean(socketState?.socket),
        isConnecting: Boolean(socketState?.isConnecting),
        status: status.status || "not_started",
        reason: status.reason || null,
        lastDisconnectCode: status.lastDisconnectCode || null,
        updatedAt: status.updatedAt || null,
        hasQr: Boolean(qr),
        qr,
    };
};

const stopReconnectTimer = (sessionId) => {
    const timer = reconnectTimers.get(sessionId);

    if (timer) {
        clearTimeout(timer);
        reconnectTimers.delete(sessionId);
    }
};

const scheduleReconnect = (sessionId, delayMs = 5000) => {
    stopReconnectTimer(sessionId);

    const timer = setTimeout(() => {
        reconnectTimers.delete(sessionId);
        startWhatsAppSession({ sessionId, force: true }).catch(async (error) => {
            await setStatus(sessionId, {
                status: "reconnect_failed",
                reason: error.message,
            });
        });
    }, delayMs);

    reconnectTimers.set(sessionId, timer);
};

const startWhatsAppSession = async ({ sessionId = "main", force = false } = {}) => {
    const redis = getRedisClient();
    const keys = getKeys(sessionId);
    const existing = sockets.get(sessionId);

    if (existing?.socket && !force) {
        return getSessionStatus(sessionId);
    }

    if (existing?.isConnecting && !force) {
        return getSessionStatus(sessionId);
    }

    if (existing?.socket && force) {
        try {
            existing.socket.end?.(new Error("Restarting WhatsApp session"));
        } catch (error) {
            console.error("Failed to close previous WhatsApp socket:", error.message);
        }
    }

    sockets.set(sessionId, {
        socket: null,
        isConnecting: true,
    });

    await setStatus(sessionId, {
        status: "connecting",
        reason: "Starting WhatsApp socket",
    });

    const { state, saveCreds } = await useRedisAuthState(redis, sessionId);

    const socket = makeWASocket({
        auth: state,
        logger: P({ level: process.env.WA_LOG_LEVEL || "silent" }),
        browser: [
            process.env.WA_BROWSER_NAME || "VPS WA Bot",
            process.env.WA_BROWSER_TYPE || "Chrome",
            process.env.WA_BROWSER_VERSION || "1.0.0",
        ],
        printQRInTerminal: false,
        syncFullHistory: false,
    });

    sockets.set(sessionId, {
        socket,
        isConnecting: true,
    });

    socket.ev.on("creds.update", saveCreds);

    socket.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            await redis.set(keys.qr, qr, "EX", Number(process.env.WA_QR_TTL_SECONDS || 60));

            if (String(process.env.WA_PRINT_QR || "true") === "true") {
                console.log(`Scan QR WhatsApp session '${sessionId}':`);
                qrcode.generate(qr, { small: true });
            }

            await setStatus(sessionId, {
                status: "qr",
                reason: "Scan QR from WhatsApp Linked Devices",
            });
        }

        if (connection === "open") {
            stopReconnectTimer(sessionId);
            await redis.del(keys.qr);

            sockets.set(sessionId, {
                socket,
                isConnecting: false,
            });

            await setStatus(sessionId, {
                status: "connected",
                reason: "WhatsApp connected",
                lastDisconnectCode: "",
            });

            console.log(`WhatsApp session '${sessionId}' connected`);
        }

        if (connection === "close") {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const isLoggedOut = statusCode === DisconnectReason.loggedOut;
            const reason = lastDisconnect?.error?.message || "WhatsApp disconnected";

            sockets.delete(sessionId);

            await setStatus(sessionId, {
                status: isLoggedOut ? "logged_out" : "disconnected",
                reason,
                lastDisconnectCode: String(statusCode || "unknown"),
            });

            if (isLoggedOut) {
                await redis.del(keys.qr);
                console.log(`WhatsApp session '${sessionId}' logged out. Scan QR again.`);
                return;
            }

            scheduleReconnect(sessionId, Number(process.env.WA_RECONNECT_DELAY_MS || 5000));
        }
    });

    socket.ev.on("messages.upsert", async ({ messages }) => {
        const message = messages?.[0];

        if (!message?.message) return;

        await redis.set(
            keys.lastMessage,
            JSON.stringify({
                from: message.key?.remoteJid || null,
                messageId: message.key?.id || null,
                timestamp: Date.now(),
            })
        );
    });

    return getSessionStatus(sessionId);
};

const sendWhatsAppSocketMessage = async ({ sessionId = "main", phoneNo, message }) => {
    const session = sockets.get(sessionId);

    if (!session?.socket) {
        throw new Error("WhatsApp socket is not ready. Start session and scan QR first.");
    }

    const status = await getSessionStatus(sessionId);

    if (status.status !== "connected") {
        throw new Error(`WhatsApp session is not connected. Current status: ${status.status}`);
    }

    const jid = buildJid(phoneNo);
    const result = await session.socket.sendMessage(jid, { text: message });

    return {
        jid,
        messageId: result?.key?.id || null,
    };
};

const logoutWhatsAppSession = async (sessionId = "main") => {
    const redis = getRedisClient();
    const keys = getKeys(sessionId);
    const session = sockets.get(sessionId);

    stopReconnectTimer(sessionId);

    if (session?.socket) {
        try {
            await session.socket.logout();
        } catch (error) {
            console.error("Failed to logout WhatsApp socket:", error.message);
        }
    }

    sockets.delete(sessionId);
    const removedAuthKeys = await clearRedisAuthState(redis, sessionId);
    await redis.del(keys.qr);

    await setStatus(sessionId, {
        status: "logged_out",
        reason: "Session logged out manually",
        removedAuthKeys: String(removedAuthKeys),
    });

    return {
        sessionId,
        removedAuthKeys,
    };
};

const restartWhatsAppSession = async (sessionId = "main") => {
    const session = sockets.get(sessionId);

    stopReconnectTimer(sessionId);

    if (session?.socket) {
        try {
            session.socket.end?.(new Error("Manual restart"));
        } catch (error) {
            console.error("Failed to close WhatsApp socket:", error.message);
        }
    }

    sockets.delete(sessionId);

    return startWhatsAppSession({ sessionId, force: true });
};

module.exports = {
    startWhatsAppSession,
    restartWhatsAppSession,
    getSessionStatus,
    sendWhatsAppSocketMessage,
    logoutWhatsAppSession,
};
