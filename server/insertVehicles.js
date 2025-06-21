const mongoose = require("mongoose");
const Vehicle = require("./models/Vehicle");
require("dotenv").config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const vehicles = [
  {
    make: "Toyota",
    model: "Corolla",
    year: 2022,
    licensePlate: "ABC123",
    vehicleType: "sedan",
    capacity: 5,
    transmission: "automatic",
    fuelType: "petrol",
    pricePerDay: 50,
    location: "Kathmandu",
    availability: true,
    images: ["https://imgd.aeplcdn.com/664x374/n/cw/ec/139139/harrier-facelift-exterior-right-front-three-quarter-5.jpeg?isig=0&q=80"],
    features: ["GPS", "Bluetooth"],
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2021,
    licensePlate: "XYZ789",
    vehicleType: "sedan",
    capacity: 5,
    transmission: "manual",
    fuelType: "diesel",
    pricePerDay: 60,
    location: "Pokhara",
    availability: true,
    images: ["https://mfcwl-vehicle-live-web-images.s3.us-west-2.amazonaws.com/live_web_images/usedcarsimg/mfc/4235/517617/cover_image-20220625190355.jpeg"],
    features: ["Air Conditioning", "Heated Seats"],
  },
  {
    make: "Ford",
    model: "Endeavour",
    year: 2020,
    licensePlate: "JKL456",
    vehicleType: "suv",
    capacity: 7,
    transmission: "automatic",
    fuelType: "diesel",
    pricePerDay: 80,
    location: "Lalitpur",
    availability: true,
    images: ["https://imgd.aeplcdn.com/1920x1080/n/cw/ec/37640/endeavour-exterior-right-front-three-quarter-149471.jpeg?q=80&q=80"],
    features: ["4WD", "Sunroof"],
  },
];

const insertVehicles = async () => {
  await Vehicle.deleteMany({});
  await Vehicle.insertMany(vehicles);
  console.log("Sample vehicles inserted!");
  mongoose.disconnect();
};

insertVehicles(); 