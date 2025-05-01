const express = require('express');
const { authenticateAdmin } = require('../middlewares/auth');
const { 
  getPendingDevices,
  approveDevice,
  denyDevice,
  getAllUsers,
  toggleUserStatus
} = require('../controllers/adminController');

const router = express.Router();

// User management routes
router.get('/users', authenticateAdmin, getAllUsers);
router.patch('/users/:userId/status', authenticateAdmin, toggleUserStatus);

// Device management routes
router.get('/devices/pending', authenticateAdmin, getPendingDevices);
router.put('/device/approve/:userId/:deviceId', authenticateAdmin, approveDevice);
router.put('/device/deny/:userId/:deviceId', authenticateAdmin, denyDevice);

module.exports = router;