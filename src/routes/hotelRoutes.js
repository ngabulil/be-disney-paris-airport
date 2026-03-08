const express = require("express");
const router = express.Router();

const {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
} = require("../controllers/hotelControllers");

const authMiddleware = require("../middlewares/authMiddleware");

// Protect all hotel routes
router.post("/", authMiddleware, createHotel);
router.get("/", getAllHotels);
router.get("/:id",  getHotelById);
router.put("/:id", authMiddleware, updateHotel);
router.delete("/:id", authMiddleware, deleteHotel);

module.exports = router;