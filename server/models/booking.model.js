const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  dropoffLocation: {
    type: String,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  paymentDetails: {
    method: String,
    transactionId: String,
    paidAmount: Number,
    paidAt: Date
  },
  additionalServices: [{
    type: String,
    enum: ['insurance', 'gps', 'childSeat', 'additionalDriver']
  }],
  bookingNotes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Add indexes for common queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ vehicle: 1, startDate: 1, endDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking; 