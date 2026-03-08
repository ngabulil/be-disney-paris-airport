const express = require("express");
const router = express.Router();

const {
    createTrip,
    getAllTrips,
    getTripById,
    updateTrip,
    deleteTrip
} = require("../controllers/tripControllers");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getAllTrips);
router.get("/:id", authMiddleware, getTripById);
router.put("/:id", authMiddleware, updateTrip);
router.delete("/:id", authMiddleware, deleteTrip);

module.exports = router;