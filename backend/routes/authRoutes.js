const express = require('express');
const { register, verifyOtp, userLogin, adminLogin } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', userLogin);
router.post('/admin/login', adminLogin);

module.exports = router;
