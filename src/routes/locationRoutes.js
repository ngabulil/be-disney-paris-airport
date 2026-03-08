const express = require("express");
const router = express.Router();

const {
    createLocation,
    getAllLocations,
    getLocationById,
    updateLocation,
    deleteLocation,
} = require("../controllers/locationControllers");

const authMiddleware = require("../middlewares/authMiddleware");

// Protected routes
router.post("/", authMiddleware, createLocation);
router.get("/", getAllLocations);
router.get("/:id", authMiddleware, getLocationById);
router.put("/:id", authMiddleware, updateLocation);
router.delete("/:id", authMiddleware, deleteLocation);

module.exports = router;