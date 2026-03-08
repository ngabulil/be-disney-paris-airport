const express = require("express");
const router = express.Router();

const {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
} = require("../controllers/vehicleControllers");
const authMiddleware = require("../middlewares/authMiddleware");

// Protected routes
router.post("/", authMiddleware, createVehicle);
router.get("/", authMiddleware, getAllVehicles);
router.get("/:id", authMiddleware, getVehicleById);
router.put("/:id", authMiddleware, updateVehicle);
router.delete("/:id", authMiddleware, deleteVehicle);

module.exports = router;