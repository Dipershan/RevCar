const express = require('express');
const router = express.Router();
const userRoutes =  require("./user.route");
const carRoutes =  require("./car.route");
const bookingRoutes = require("./booking.route");
const adminRoutes = require('./admin.route');

    router.get("/api" , async(req, res , next)=>{
        res.json({message: "Car Rental API is not working....."})
    });
    
    router.use("/api/users" , userRoutes);
    router.use("/api/cars" , carRoutes);
     router.use("/api/bookings" , bookingRoutes  )
     router.use("/api/dashboard" , adminRoutes  )


module.exports = router;
