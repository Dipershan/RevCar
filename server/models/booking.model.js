const mongoose =  require("mongoose");

const BookingSchema = new mongoose.Schema({

    car:{
        type: mongoose.Schema.Types.ObjectId , 
        ref: 'Car'        
    },
    user : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },  
     bookedTimeSlots : 
        {
        from:{type: String },
        to :{type:String }
        },
    totalHours : {type: Number},
    totalAmount: {
        type:Number,
    },
    transactionId : {
        type: String,
        unique: true
    },
    status:{
        type: String,
        enum :["Pending", "Confirmed","Cancelled"],
        default: "Pending"
    }
},{timestamps: true });

// BookingSchema.index({ car: 1 });
// BookingSchema.index({ user: 1 });
// BookingSchema.index({ status: 1 });

module.exports = mongoose.model("Booking" , BookingSchema);

 