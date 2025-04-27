const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const geoip = require('geoip-lite');
const moment = require('moment'); // To handle OTP expiry times
const axios = require('axios');
const { sendDeviceApprovalNotification } = require('../services/notificationService');

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
    const { fullName, email, password, phoneNumber, department, role, fingerprint, deviceDetails, browserDetails, location } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = moment().add(10, 'minutes').toISOString(); // OTP expires in 10 minutes

        await Otp.create({ email, otp: otpCode, expiry: otpExpiry });

        await transporter.sendMail({
            from: `"ZTNA System" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otpCode}. It will expire in 10 minutes.`,
        });

        // Track the device fingerprint and mark it as pending approval
        const newDevice = {
            fingerprint,
            deviceDetails,
            browserDetails,
            location,
            approved: false, // Initially not approved
        };

        // Save the device data to be approved by the admin
        await User.updateOne({ email }, { $push: { devices: newDevice } });

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
// Login Module
exports.login = async (req, res) => {
    const { email, password, fingerprint, ipAddress, location, browserDetails, deviceDetails } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        // Check if device is already registered
        let device = user.devices.find(d => d.fingerprint === fingerprint);

        if (!device) {
            // If device not found, create a pending device
            user.devices.push({
                fingerprint,
                ipAddress,
                location,
                browserDetails,
                deviceDetails,
                approved: false, // Flag this device as pending approval
            });
            await user.save();

            // Notify the admin to approve the new device
            sendDeviceApprovalNotification(user, fingerprint);

            return res.status(403).json({ message: 'New Device Registered. Waiting for Admin Approval.' });
        }

        if (!device.approved) {
            return res.status(403).json({ message: 'Device not approved yet by Admin.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '1h' }
        );

        // Save session
        user.sessions.push({
            token,
            ipAddress,
            location,
            deviceFingerprint: fingerprint,
            loginTime: new Date(),
        });
        await user.save();

        res.status(200).json({
            message: 'Login Successful',
            token,
            user: {
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};