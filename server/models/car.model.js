const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  capacity: { type: Number, required: true },
  fuelType: { type: String, required: true },
  rentPerHour: { type: Number, required: true },
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

const Car = mongoose.model('Car', carSchema);
module.exports = Car; 