const mongoose = require("mongoose");

const securityAlertSchema = new mongoose.Schema({
    level: { type: String, enum: ["high", "medium", "low"] },
    message: String,
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("SecurityAlert", securityAlertSchema);