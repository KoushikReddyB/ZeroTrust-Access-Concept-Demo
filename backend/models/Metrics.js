const mongoose = require("mongoose");

const metricSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['network_latency', 'auth_success', 'auth_failure', 'resource_access', 'device_compliance']
  },
  value: Number,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceId: String,
  timestamp: { type: Date, default: Date.now }
});

// Add indexes for common queries
metricSchema.index({ type: 1, timestamp: -1 });
metricSchema.index({ userId: 1, type: 1, timestamp: -1 });

module.exports = mongoose.model("Metric", metricSchema);