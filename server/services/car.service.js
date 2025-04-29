const Car = require("../models/car.model");

exports.getAllCars = async () => {
    return await Car.find({});
};

exports.addCar = async (carData) => {
    const newCar = new Car(carData);
    return await newCar.save();
};

exports.editCar = async (carData) => {
    return await Car.findByIdAndUpdate(carData._id, carData, { new: true });
};

exports.deleteCar = async (carId) => {
    return await Car.findByIdAndDelete(carId);
};


exports.getCarById = async (carId) => {
    const car = await Car.findById(carId);
    if (!car) return null;
    
    const availabilityStatus = "Available"; 
    const serviceRecords = [
        { date: "2024-01-15", description: "Oil change" },
        { date: "2024-03-10", description: "Tire replacement" }
    ];

    const carWithExtras = {
        ...car.toObject(),
        availabilityStatus,
        serviceRecords
    };

    return carWithExtras;
};
