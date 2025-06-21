const Vehicle = require('../models/car.model');

// Get all vehicles with filters
exports.getVehicles = async (req, res) => {
  try {
    const {
      vehicleType,
      location,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      transmission,
      capacity
    } = req.query;

    let query = { availability: true };

    if (vehicleType) query.vehicleType = vehicleType;
    if (location) query.location = location;
    if (transmission) query.transmission = transmission;
    if (capacity) query.capacity = { $gte: parseInt(capacity) };
    if (minPrice) query.pricePerDay = { $gte: parseFloat(minPrice) };
    if (maxPrice) {
      query.pricePerDay = { ...query.pricePerDay, $lte: parseFloat(maxPrice) };
    }

    // If dates are provided, check availability
    if (startDate && endDate) {
      const unavailableVehicles = await Booking.distinct('vehicle', {
        $or: [
          {
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) }
          }
        ],
        status: { $in: ['confirmed', 'ongoing'] }
      });
      
      query._id = { $nin: unavailableVehicles };
    }

    const vehicles = await Vehicle.find(query);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single vehicle
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    Object.assign(vehicle, req.body);
    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.remove();
    res.json({ message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update vehicle condition
exports.updateVehicleCondition = async (req, res) => {
  try {
    const { status, mileage, notes } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    vehicle.currentCondition = {
      ...vehicle.currentCondition,
      status: status || vehicle.currentCondition.status,
      mileage: mileage || vehicle.currentCondition.mileage,
      notes: notes || vehicle.currentCondition.notes,
      lastInspection: new Date()
    };

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add service record
exports.addServiceRecord = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    vehicle.serviceHistory.push({
      ...req.body,
      date: new Date()
    });

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 