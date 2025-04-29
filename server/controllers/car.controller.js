const carService = require("../services/car.service");

exports.getAllCars = async (req, res) => {
    try {
        const cars = await carService.getAllCars();
        res.status(200).json(cars);
    } catch (error) {
        res.status(400).json({ message: "Error fetching cars" });
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
