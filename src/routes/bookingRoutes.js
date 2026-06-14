const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  checkBookingPrice,
  downloadAdminBookingPdf,
  downloadCustomerBookingPdf
} = require("../controllers/bookingControllers");

// Admin protected (recommended)
router.post("/", createBooking);
router.get("/", authMiddleware, getAllBookings);
router.get("/:id", authMiddleware, getBookingById);
router.put("/:id", authMiddleware, updateBooking);
router.delete("/:id", authMiddleware, deleteBooking);
router.post("/check-price", checkBookingPrice);
router.get("/download/admin-pdf/:id", authMiddleware, downloadAdminBookingPdf);
router.get("/download/customer-pdf/:id", authMiddleware, downloadCustomerBookingPdf);

module.exports = router;