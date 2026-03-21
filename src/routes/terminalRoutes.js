const express = require("express");
const router = express.Router();

const {
    createTerminal,
    getAllTerminals,
    getTerminalById,
    updateTerminal,
    deleteTerminal,
} = require("../controllers/terminalControllers");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createTerminal);
router.get("/", getAllTerminals);
router.get("/:id", getTerminalById);
router.put("/:id", authMiddleware, updateTerminal);
router.delete("/:id", authMiddleware, deleteTerminal);

module.exports = router;