const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const { authenticateUser } = require("../middlewares/authenticateUser");

router.post("/bookcar", bookingController.bookCar);
router.post("/add", authenticateUser, bookingController.addBooking);
router.get("/user", authenticateUser, bookingController.getUserBookings);
router.get("/booked-slots/:carId", bookingController.getBookedSlots);
router.get("/getallbookings", bookingController.getAllBookings);

module.exports = router;
