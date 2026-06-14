const express = require("express");
const router = express.Router();

const {
    updateWaKey,
    startWaSession,
    restartWaSession,
    getWaSessionStatus,
    getWaSessionQr,
    sendWaMessage,
    logoutWaSession,
} = require("../controllers/waControllers");

// Existing route for Watzap number key config
router.get("/update-key", updateWaKey);

// Redis + Baileys WhatsApp session routes
router.post("/session/start", startWaSession);
router.post("/session/restart", restartWaSession);
router.get("/session/status", getWaSessionStatus);
router.get("/session/qr", getWaSessionQr);
router.post("/session/logout", logoutWaSession);
router.post("/message/send", sendWaMessage);

// Optional multi-session routes, example: /api/wa/session/main/start
router.post("/session/:sessionId/start", startWaSession);
router.post("/session/:sessionId/restart", restartWaSession);
router.get("/session/:sessionId/status", getWaSessionStatus);
router.get("/session/:sessionId/qr", getWaSessionQr);
router.post("/session/:sessionId/logout", logoutWaSession);
router.post("/session/:sessionId/message/send", sendWaMessage);

module.exports = router;
