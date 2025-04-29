const mongoose = require("mongoose");

const serviceRecordSchema = new mongoose.Schema({
    date: { type: String, required: true },
    description: { type: String, required: true }
  });

const CarSchema =  new mongoose.Schema({
    name:{
        type :String, 
        required : true,
    },
    image:{
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true,
    },
    fuelType:{
        type: String,
        required : true
    },
    bookedTimeSlots:[
        {
            from:{type:String,  required: true},
            to:{type: String , required: true}
        }
    ],
    rentPerHour:{
        type:Number,
        required: true
    },
    availabilityStatus: {
        type: String,
        enum: ['Available', 'Unavailable', 'In Service'],
        default: 'Available',
    },
    serviceRecords: [serviceRecordSchema]
    
},{timestamps: true }
);

const CarModel = mongoose.model("Car" , CarSchema);

module.exports =  CarModel;

