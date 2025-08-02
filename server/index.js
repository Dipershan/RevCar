require("dotenv").config();
const express =  require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const carRoutes = require('./routes/car.route');
const userRoutes = require('./routes/user.route');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(
    process.env.DB_URL 
).then(()=>{
    console.log("DataBase Connected Sucessfully");
})
.catch((e)=>{
    console.log("Database Error" ,  e);
});

app.get("/" , (req , res)=>{
    res.json("HelloWorld");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
