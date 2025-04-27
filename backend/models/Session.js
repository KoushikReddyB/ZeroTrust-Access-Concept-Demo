const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  ipAddress: String,
  deviceDetails: String,
  isActive: Boolean,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Session", sessionSchema);