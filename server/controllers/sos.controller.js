const SOS = require("../models/sos.model");

exports.reportSOS = async (req, res) => {
  try {
    const { userId, issue, location } = req.body;

    const newSOS = new SOS({
      userId,
      issue,
      location,
      status: "Pending",
    });

    await newSOS.save();
    res.status(201).json({ message: "SOS Alert Sent Successfully" });
    
  } catch (error) {
    res.status(500).json({ message: "Error reporting SOS" });
  }
};
