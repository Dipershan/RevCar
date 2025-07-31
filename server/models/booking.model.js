const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  bookedTimeSlots: {
    from: { type: String, required: true },
    to: { type: String, required: true }
  },
  totalHours: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  driverRequired: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'confirmed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Add indexes for common queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ car: 1, 'bookedTimeSlots.from': 1, 'bookedTimeSlots.to': 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking; 