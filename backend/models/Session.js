const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ipAddress: String,
  deviceDetails: String,
  browserDetails: String,
  location: {
    lat: Number,
    lon: Number
  },
  isActive: { type: Boolean, default: true },
  lastActivity: { type: Date, default: Date.now },
  loginTime: { type: Date, default: Date.now },
  logoutTime: Date,
  revokedAt: Date,
  revokedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  revokedReason: String,
  accessHistory: [{
    resource: String,
    timestamp: { type: Date, default: Date.now },
    success: Boolean,
    failureReason: String
  }]
});

// Add index for performance
sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ lastActivity: 1 });

module.exports = mongoose.model("Session", sessionSchema);