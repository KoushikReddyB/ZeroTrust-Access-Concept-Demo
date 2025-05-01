const User = require('../models/User');
const Session = require('../models/Session');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const geoip = require('geoip-lite');
const moment = require('moment');
const axios = require('axios');
const { sendDeviceApprovalNotification } = require('../services/notificationService');

// Corrected transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL || "2200090018csit@gmail.com",
        pass: process.env.SMTP_PASSWORD || "vkxpkhnosgcccbrh"
    }
});

exports.register = async (req, res) => {
    const { fullName, email, password, phoneNumber, department, role, fingerprint, deviceDetails, browserDetails, location } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = moment().add(10, 'minutes').toISOString();

        await Otp.create({ email, otp: otpCode, expiry: otpExpiry });

        await transporter.sendMail({
            from: `"ZTNA System" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otpCode}. It will expire in 10 minutes.`,
        });

        const newDevice = {
            fingerprint,
            deviceDetails,
            browserDetails,
            location,
            approved: false,
        };

        const user = new User({
            fullName,
            email,
            password: await bcrypt.hash(password, 10),
            phoneNumber,
            department,
            role,
            devices: [newDevice]
        });
        await user.save();

        res.status(200).json({ message: 'OTP Sent Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const loginHandler = async (req, res, expectedRole) => {
  const { email, password, fingerprint, ipAddress, location, browserDetails, deviceDetails } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.role !== expectedRole) {
      return res.status(403).json({ message: 'Access Denied: Incorrect Role' });
    }

    let device = user.devices.find(d => d.fingerprint === fingerprint);

    if (!device) {
      device = {
        fingerprint,
        ipAddress,
        location,
        browserDetails,
        deviceDetails,
        approved: false,
      };
      user.devices.push(device);
      await user.save();
      sendDeviceApprovalNotification(user, fingerprint);
      return res.status(403).json({ message: 'New Device Registered. Waiting for Admin Approval.' });
    }

    if (!device.approved) {
      return res.status(403).json({ message: 'Device not approved yet by Admin.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '1h' }
    );

    // Create new session
    await Session.create({
      userId: user._id,
      ipAddress,
      deviceDetails,
      browserDetails,
      location,
      isActive: true
    });

    // Update device last used timestamp
    device.lastUsed = new Date();
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

exports.userLogin = async (req, res) => {
  await loginHandler(req, res, 'user');
};

exports.adminLogin = async (req, res) => {
  await loginHandler(req, res, 'admin');
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const validOtp = await Otp.findOne({ email, otp });

        if (!validOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const otpExpiry = moment(validOtp.expiry);
        if (moment().isAfter(otpExpiry)) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Clean up OTPs after successful verification
        await Otp.deleteMany({ email });

        res.status(200).json({ message: 'OTP Verified Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};