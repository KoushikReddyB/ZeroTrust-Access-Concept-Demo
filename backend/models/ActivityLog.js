const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: {
    type: String,
    required: true,
    enum: ['attempt', 'login', 'logout', 'device_approval', 'device_denial', 'navigation', 'download']
  },
  resource: String,
  details: String,
  ipAddress: String,
  location: {
    lat: Number,
    lon: Number
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);