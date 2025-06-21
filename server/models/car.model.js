const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleType: {
    type: String,
    enum: ['sedan', 'suv', 'luxury', 'sports', 'van'],
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  transmission: {
    type: String,
    enum: ['automatic', 'manual'],
    required: true,
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  images: [{
    type: String,  // URLs to car images
  }],
  features: [{
    type: String,  // Additional features like GPS, Bluetooth, etc.
  }],
  currentCondition: {
    status: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'maintenance'],
      default: 'good'
    },
    lastInspection: Date,
    mileage: Number,
    notes: String
  },
  serviceHistory: [{
    date: Date,
    type: String,
    description: String,
    mileage: Number,
    cost: Number
  }]
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle; 