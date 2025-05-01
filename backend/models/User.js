const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    fingerprint: String,
    ipAddress: String,
    location: {
        lat: Number,
        lon: Number,
    },
    browserDetails: String,
    deviceDetails: String,
    approved: { type: Boolean, default: false },
    lastUsed: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    phoneNumber: String,
    department: String,
    role: { type: String, default: "user" },
    devices: [deviceSchema],
    downloads: { type: Number, default: 0 },
    navigations: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);