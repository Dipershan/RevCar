const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Protected routes (user)
router.post('/', protect, bookingController.createBooking);
router.get('/my-bookings', protect, bookingController.getUserBookings);
router.get('/:id', protect, bookingController.getBooking);
router.post('/:id/cancel', protect, bookingController.cancelBooking);

// Protected routes (admin only)
router.put('/:id/status', protect, adminOnly, bookingController.updateBookingStatus);
router.put('/:id/payment', protect, adminOnly, bookingController.updatePaymentStatus);

module.exports = router; 