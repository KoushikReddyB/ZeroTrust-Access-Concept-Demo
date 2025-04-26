const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const moment = require('moment'); // To handle OTP expiry times

// Corrected transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL || "2200090018csit@gmail.com", // corrected key
        pass: process.env.SMTP_PASSWORD || "vkxpkhnosgcccbrh" // corrected key
    }
});

// Registration - send OTP
exports.register = async (req, res) => {
    const { fullName, email, password, phoneNumber, department, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = moment().add(10, 'minutes').toISOString(); // OTP expires in 10 minutes

        await Otp.create({ email, otp: otpCode, expiry: otpExpiry });

        await transporter.sendMail({
            from: `"ZTNA System" <${process.env.SMTP_EMAIL}>`, // corrected key
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otpCode}. It will expire in 10 minutes.`,
        });

        res.status(200).json({ message: 'OTP Sent Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

// OTP Verification and User Save
exports.verifyOtp = async (req, res) => {
    const { fullName, email, password, phoneNumber, department, role, otp } = req.body;
    try {
        const validOtp = await Otp.findOne({ email, otp });

        if (!validOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Check if OTP is expired
        const otpExpiry = moment(validOtp.expiry);
        if (moment().isAfter(otpExpiry)) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user only after OTP is verified
        await User.create({ fullName, email, password: hashedPassword, phoneNumber, department, role });

        // Clean up OTPs after successful registration
        await Otp.deleteMany({ email });

        res.status(201).json({ message: 'User Registered Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};
