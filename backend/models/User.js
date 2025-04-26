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
    createdAt: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
    token: String,
    ipAddress: String,
    location: {
        lat: Number,
        lon: Number,
    },
    deviceFingerprint: String,
    loginTime: { type: Date, default: Date.now },
    logoutTime: Date,
});

const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    phoneNumber: String,
    department: String,
    role: { type: String, default: "user" },
    devices: [deviceSchema],
    sessions: [sessionSchema],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
