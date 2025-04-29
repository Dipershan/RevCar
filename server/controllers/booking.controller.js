const bookingService = require("../services/booking.service");

const bookCar = async (req, res) => {
  try {
    await bookingService.bookCar(req.body);
    res.status(201).json({ message: "Booking successful!" });
  } catch (error) {
    console.error("Error booking car:", error);
    res.status(400).json({ error: error.message });
  }
};

const addBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      carId,
      fromTime,
      toTime,
      totalHours,
      totalAmount,
      transactionId,
    } = req.body;

    const bookingData = {
      user: userId,
      car: carId,
      bookedTimeSlots: { from: fromTime, to: toTime },
      totalHours,
      totalAmount,
      transactionId,
      status: "Confirmed",
    };

    const newBooking = await bookingService.createBooking(bookingData);
    res.status(201).json({ success: true, booking: newBooking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await bookingService.getBookingsByUser(userId);
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(400).json({ error: error.message });
  }
};

const getBookedSlots = async (req, res) => {
  try {
    const slots = await bookingService.getBookedSlots(req.params.carId);
    res.status(200).json(slots);
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  bookCar,
  addBooking,
  getUserBookings,
  getAllBookings,
  getBookedSlots,
};
