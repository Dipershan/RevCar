const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  capacity: { type: Number, required: true },
  fuelType: { type: String, required: true },
  rentPerHour: { type: Number, required: true },
  // Location fields for search functionality
  location: { 
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  // Additional fields for better search
  type: { type: String, required: true }, // SUV, Sedan, Luxury, etc.
  transmission: { type: String, default: 'Manual' }, // Manual, Automatic, CVT
  features: [{ type: String }], // Array of features like AC, GPS, etc.
  brand: { type: String },
  model: { type: String },
  year: { type: Number },
  bookedTimeSlots: [
    {
      from: { type: String },
      to: { type: String }
    }
  ],
  availabilityStatus: { type: String, default: 'Available' },
  serviceRecords: [
    {
      serviceDate: { type: String },
      description: { type: String },
      cost: { type: Number }
    }
  ]
});

// Add indexes for better search performance
carSchema.index({ 'location.city': 1 });
carSchema.index({ 'location.state': 1 });
carSchema.index({ type: 1 });
carSchema.index({ fuelType: 1 });
carSchema.index({ capacity: 1 });
carSchema.index({ rentPerHour: 1 });
carSchema.index({ availabilityStatus: 1 });

const Car = mongoose.model('Car', carSchema);
module.exports = Car; 