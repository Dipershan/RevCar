const mongoose = require("mongoose");
const Booking = require("../models/booking.model");
const Car = require("../models/car.model");

const bookCar = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      transactionRef,
      user,
      car,
      totalHours,
      totalAmount,
      driverRequired,
      bookedTimeSlots,
    } = data;

    if (!transactionRef) {
      throw new Error("Transaction reference is missing from Paystack");
    }

    const carToUpdate = await Car.findById(car).session(session);
    if (!carToUpdate) throw new Error("Car not found");

    const newBooking = new Booking({
      user,
      car,
      totalHours,
      totalAmount,
      driverRequired,
      bookedTimeSlots,
      transactionId: transactionRef,
    });

    await newBooking.save({ session });

    carToUpdate.bookedTimeSlots = [
      ...carToUpdate.bookedTimeSlots,
      ...[bookedTimeSlots].filter(
        (slot) =>
          !carToUpdate.bookedTimeSlots.some(
            (existingSlot) =>
              existingSlot.from === slot.from && existingSlot.to === slot.to
          )
      ),
    ];

    await carToUpdate.save({ session });

    await session.commitTransaction();
    session.endSession();

    return newBooking;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const getAllCars = async () => {
  return await Car.find({});
};
const getBookingsByUser = async (userId) => {
  return await Booking.find({ user: userId }).populate("car");
};

const getBookedSlots = async (carId) => {
  const car = await Car.findById(carId);
  if (!car) throw new Error("Car not found");
  return car.bookedTimeSlots;
};

const getAllBookings = async () => {
  return await Booking.find().populate("car");
};

const createBooking = async (bookingData) => {
  try {
    const { car, bookedTimeSlots, user, totalHours, totalAmount, transactionId, driverRequired, status } = bookingData;

    console.log("Creating booking with data:", bookingData);

    // Check if car exists
    const carToUpdate = await Car.findById(car);
    if (!carToUpdate) throw new Error("Car not found");

    // Create the booking
    const newBooking = new Booking({
      user,
      car,
      bookedTimeSlots,
      totalHours,
      totalAmount,
      transactionId,
      driverRequired,
      status
    });

    console.log("Saving booking:", newBooking);

    await newBooking.save();

    // Update car's booked time slots
    carToUpdate.bookedTimeSlots = [
      ...carToUpdate.bookedTimeSlots,
      bookedTimeSlots
    ].filter((slot, index, array) => 
      array.findIndex(s => s.from === slot.from && s.to === slot.to) === index
    );

    console.log("Updated car booked time slots:", carToUpdate.bookedTimeSlots);

    await carToUpdate.save();

    console.log("Booking created successfully:", newBooking._id);
    return newBooking;
  } catch (error) {
    console.error("Error in createBooking:", error);
    throw error;
  }
};
module.exports = {
  bookCar,
  getAllCars,
  getBookedSlots,
  getBookingsByUser ,
   getAllBookings,
   createBooking
};
