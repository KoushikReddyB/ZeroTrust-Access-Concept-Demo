const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    phoneNumber: String,
    department: String,
    role: { type: String, default: "user" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
