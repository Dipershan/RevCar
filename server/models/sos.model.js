const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({
  userId: { 
    type: String,
     required: true 
    },
  issue: { 
    type: String,
     required: true 
    },
  location: { 
    type: String 
  },
  status: { 
    type: String,
     default: "Pending"
     },
}, { timestamps: true });

module.exports = mongoose.model("SOS", sosSchema);
