const express = require("express");
const router = express.Router();

const {
    createPromo,
    getAllPromos,
    getPromoById,
    updatePromo,
    deletePromo
} = require("../controllers/promoControllers");

const authMiddleware = require("../middlewares/authMiddleware");

// Protected routes
router.post("/", authMiddleware, createPromo);
router.get("/", authMiddleware, getAllPromos);
router.get("/:id", authMiddleware, getPromoById);
router.put("/:id", authMiddleware, updatePromo);
router.delete("/:id", authMiddleware, deletePromo);

module.exports = router;