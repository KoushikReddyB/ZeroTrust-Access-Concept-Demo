const mongoose = require("mongoose");

const securityAlertSchema = new mongoose.Schema({
  level: { 
    type: String, 
    enum: ["high", "medium", "low"],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("SecurityAlert", securityAlertSchema);