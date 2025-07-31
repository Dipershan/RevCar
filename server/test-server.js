require("dotenv").config();
const mongoose = require("mongoose");

console.log("Testing server startup...");

// Test database connection
mongoose.connect("mongodb://localhost:27017/revcar")
  .then(() => {
    console.log("Database connected successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }); 