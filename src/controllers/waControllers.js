const Wa = require("../models/wa.model");
const { formatResponse } = require("../format/response");
const {
    startWhatsAppSession,
    restartWhatsAppSession,
    getSessionStatus,
    sendWhatsAppSocketMessage,
    logoutWhatsAppSession,
} = require("../services/baileysWaService");

const getSessionId = (req) => {
    return req.params.sessionId || req.query.sessionId || req.body?.sessionId || "main";
};

const updateWaKey = async (req, res) => {
    try {
        const { keyBusiness, keyPersonal } = req.query;

        if (!keyBusiness || !keyPersonal) {
            return formatResponse(
                res,
                400,
                "keyBusiness and keyPersonal required",
                null,
                "Validation error"
            );
        }

        const wa = await Wa.findOneAndUpdate(
            {},
            {
                keyNumberBusiness: keyBusiness,
                keyNumberPersonal: keyPersonal,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        return formatResponse(res, 200, "WA key updated successfully", {
            id: wa._id,
            keyNumberBusiness: wa.keyNumberBusiness,
            keyNumberPersonal: wa.keyNumberPersonal,
        });
    } catch (error) {
        return formatResponse(res, 500, "Server error", null, error.message);
    }
};

const startWaSession = async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const data = await startWhatsAppSession({ sessionId });

        return formatResponse(
            res,
            200,
            data.status === "connected"
                ? "WhatsApp session already connected"
                : "WhatsApp session started. Scan QR if returned.",
            data
        );
    } catch (error) {
        return formatResponse(res, 500, "Failed to start WhatsApp session", null, error.message);
    }
};

const restartWaSession = async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const data = await restartWhatsAppSession(sessionId);

        return formatResponse(res, 200, "WhatsApp session restarted", data);
    } catch (error) {
        return formatResponse(res, 500, "Failed to restart WhatsApp session", null, error.message);
    }
};

const getWaSessionStatus = async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const data = await getSessionStatus(sessionId);

        return formatResponse(res, 200, "WhatsApp session status", data);
    } catch (error) {
        return formatResponse(res, 500, "Failed to get WhatsApp session status", null, error.message);
    }
};

const getWaSessionQr = async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const data = await getSessionStatus(sessionId);

        if (!data.qr) {
            return formatResponse(res, 404, "QR not available. Start/restart session first.", data);
        }

        return formatResponse(res, 200, "WhatsApp QR available", {
            sessionId,
            qr: data.qr,
            ttlHintSeconds: Number(process.env.WA_QR_TTL_SECONDS || 60),
        });
    } catch (error) {
        return formatResponse(res, 500, "Failed to get WhatsApp QR", null, error.message);
    }
};

const sendWaMessage = async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const phoneNo = req.body?.phoneNo || req.body?.to || req.query?.phoneNo || req.query?.to;
        const message = req.body?.message || req.body?.text || req.query?.message || req.query?.text;

        if (!phoneNo || !message) {
            return formatResponse(
                res,
                400,
                "phoneNo/to and message/text are required",
                null,
                "Validation error"
            );
        }

        const data = await sendWhatsAppSocketMessage({
            sessionId,
            phoneNo,
            message,
        });

        return formatResponse(res, 200, "WhatsApp message sent", data);
    } catch (error) {
        return formatResponse(res, 500, "Failed to send WhatsApp message", null, error.message);
    }
};

const logoutWaSession = async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const data = await logoutWhatsAppSession(sessionId);

        return formatResponse(res, 200, "WhatsApp session logged out and Redis auth cleared", data);
    } catch (error) {
        return formatResponse(res, 500, "Failed to logout WhatsApp session", null, error.message);
    }
};

module.exports = {
    updateWaKey,
    startWaSession,
    restartWaSession,
    getWaSessionStatus,
    getWaSessionQr,
    sendWaMessage,
    logoutWaSession,
};
