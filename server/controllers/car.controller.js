const carService = require("../services/car.service");
const Car = require("../models/car.model");

exports.getAllCars = async (req, res) => {
    try {
        const cars = await carService.getAllCars();
        res.status(200).json(cars);
    } catch (error) {
        res.status(400).json({ message: "Error fetching cars" });
    }
};

// New advanced search function
exports.searchCars = async (req, res) => {
    try {
        const {
            search,
            location,
            pickupDate,
            returnDate,
            carType,
            priceRange,
            fuelType,
            capacity,
            transmission,
            features,
            availabilityStatus,
            minPrice,
            maxPrice
        } = req.query;

        // Build query object
        let query = {};

        // Text search (name, brand, model)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } }
            ];
        }

        // Location search
        if (location) {
            query.$or = query.$or || [];
            query.$or.push(
                { 'location.city': { $regex: location, $options: 'i' } },
                { 'location.state': { $regex: location, $options: 'i' } },
                { 'location.address': { $regex: location, $options: 'i' } }
            );
        }

        // Car type filter
        if (carType && carType !== 'all') {
            query.type = { $regex: carType, $options: 'i' };
        }

        // Price range filter
        if (priceRange && priceRange !== 'all') {
            switch (priceRange) {
                case 'low':
                    query.rentPerHour = { $lte: 1000 };
                    break;
                case 'medium':
                    query.rentPerHour = { $gt: 1000, $lte: 2000 };
                    break;
                case 'high':
                    query.rentPerHour = { $gt: 2000 };
                    break;
            }
        }

        // Custom price range
        if (minPrice || maxPrice) {
            query.rentPerHour = {};
            if (minPrice) query.rentPerHour.$gte = parseFloat(minPrice);
            if (maxPrice) query.rentPerHour.$lte = parseFloat(maxPrice);
        }

        // Fuel type filter
        if (fuelType && fuelType !== 'all') {
            query.fuelType = { $regex: fuelType, $options: 'i' };
        }

        // Capacity filter
        if (capacity && capacity !== 'all') {
            query.capacity = parseInt(capacity);
        }

        // Transmission filter
        if (transmission && transmission !== 'all') {
            query.transmission = { $regex: transmission, $options: 'i' };
        }

        // Availability status filter
        if (availabilityStatus && availabilityStatus !== 'all') {
            query.availabilityStatus = availabilityStatus;
        }

        // Features filter
        if (features && features.length > 0) {
            const featureArray = Array.isArray(features) ? features : [features];
            query.features = { $all: featureArray };
        }

        // Date-based availability check
        if (pickupDate && returnDate) {
            const startDate = new Date(pickupDate);
            const endDate = new Date(returnDate);
            
            // Find cars that don't have conflicting bookings
            query.$and = query.$and || [];
            query.$and.push({
                $or: [
                    { bookedTimeSlots: { $size: 0 } }, // No bookings
                    {
                        bookedTimeSlots: {
                            $not: {
                                $elemMatch: {
                                    from: { $lte: endDate.toISOString() },
                                    to: { $gte: startDate.toISOString() }
                                }
                            }
                        }
                    }
                ]
            });
        }

        // Execute query
        const cars = await Car.find(query).sort({ rentPerHour: 1 });

        res.status(200).json({
            success: true,
            count: cars.length,
            cars: cars
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error searching cars",
            error: error.message 
        });
    }
};

// Get available locations
exports.getLocations = async (req, res) => {
    try {
        const locations = await Car.distinct('location.city');
        const states = await Car.distinct('location.state');
        
        res.status(200).json({
            success: true,
            cities: locations,
            states: states
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching locations",
            error: error.message 
        });
    }
};

// Get car types
exports.getCarTypes = async (req, res) => {
    try {
        const types = await Car.distinct('type');
        res.status(200).json({
            success: true,
            types: types
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching car types",
            error: error.message 
        });
    }
};

// Get available features
exports.getFeatures = async (req, res) => {
    try {
        const features = await Car.distinct('features');
        res.status(200).json({
            success: true,
            features: features
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching features",
            error: error.message 
        });
    }
};

exports.addCar = async (req, res) => {
    try {
        const newCar = await carService.addCar(req.body);
        res.status(201).json({ message: "Car added successfully", car: newCar });
    } catch (error) {
        res.status(400).json({ message: "Error adding car" });
    }
};

exports.editCar = async (req, res) => {
    try {
        const updatedCar = await carService.editCar(req.body);
        res.status(200).json({ message: "Car updated successfully", car: updatedCar });
    } catch (error) {
        res.status(400).json({ message: "Error updating car" });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        await carService.deleteCar(req.body._id);
        res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting car" });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const car = await carService.getCarById(req.params.carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ message: "Error fetching car details" });
    }
};
