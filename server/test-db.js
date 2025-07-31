require("dotenv").config();
const mongoose = require("mongoose");
const Car = require("./models/car.model");

console.log("Testing database connection and car data...");

// Test database connection
mongoose.connect("mongodb://127.0.0.1:27017/carRental")
  .then(async () => {
    console.log("Database connected successfully");
    
    // Check if there are cars in the database
    const cars = await Car.find({});
    console.log(`Found ${cars.length} cars in the database`);
    
    if (cars.length === 0) {
      console.log("No cars found. You may need to run the insertCars.js script.");
    } else {
      console.log("Cars found:", cars.map(car => car.name));
    }
    
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }); 