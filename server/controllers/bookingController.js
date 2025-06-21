const Booking = require('../models/booking.model');
const Vehicle = require('../models/car.model');
const User = require('../models/user.model');
const moment = require('moment');

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      additionalServices
    } = req.body;

    // Check if vehicle is available for the requested dates
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check for existing bookings in the date range
    const conflictingBooking = await Booking.findOne({
      vehicle: vehicleId,
      status: { $in: ['confirmed', 'ongoing'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Vehicle is not available for the selected dates' });
    }

    // Calculate total cost
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    let totalCost = days * vehicle.pricePerDay;

    // Add costs for additional services
    if (additionalServices) {
      additionalServices.forEach(service => {
        switch (service) {
          case 'insurance':
            totalCost += days * 15; // $15 per day for insurance
            break;
          case 'gps':
            totalCost += days * 5; // $5 per day for GPS
            break;
          case 'childSeat':
            totalCost += days * 10; // $10 per day for child seat
            break;
          case 'additionalDriver':
            totalCost += days * 20; // $20 per day for additional driver
            break;
        }
      });
    }

    const booking = new Booking({
      user: req.user._id, // Assuming user is attached by auth middleware
      vehicle: vehicleId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      totalCost,
      additionalServices
    });

    const savedBooking = await booking.save();

    // Add booking to user's booking history
    await User.findByIdAndUpdate(req.user._id, {
      $push: { bookingHistory: savedBooking._id }
    });

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('vehicle')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle')
      .populate('user', '-password');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    
    // If status is completed, update vehicle availability
    if (status === 'completed') {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { availability: true });
    }
    // If status is confirmed, update vehicle availability
    else if (status === 'confirmed') {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { availability: false });
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking can be cancelled
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Booking cannot be cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Update vehicle availability
    await Vehicle.findByIdAndUpdate(booking.vehicle, { availability: true });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentDetails } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = paymentStatus;
    booking.paymentDetails = {
      ...booking.paymentDetails,
      ...paymentDetails,
      paidAt: new Date()
    };

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 