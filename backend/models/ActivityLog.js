const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
    user: String,
    action: String,
    resource: String,
    timestamp: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("ActivityLog", activityLogSchema);