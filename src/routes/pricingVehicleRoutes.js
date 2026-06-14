const express = require("express");
const router = express.Router();

const {
    createPricingVehicle,
    getAllPricingVehicle,
    getPricingVehicleById,
    updatePricingVehicle,
    deletePricingVehicle
} = require("../controllers/pricingVehicleControllers");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createPricingVehicle);
router.get("/", authMiddleware, getAllPricingVehicle);
router.get("/:id", authMiddleware, getPricingVehicleById);
router.put("/:id", authMiddleware, updatePricingVehicle);
router.delete("/:id", authMiddleware, deletePricingVehicle);

module.exports = router;