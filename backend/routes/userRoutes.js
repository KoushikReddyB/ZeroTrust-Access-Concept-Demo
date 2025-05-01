const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authUser');
const { getUserDevices } = require('../controllers/userController');

router.get('/devices', authenticateUser, getUserDevices);

module.exports = router;