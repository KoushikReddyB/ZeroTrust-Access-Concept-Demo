const express = require('express');
const { getAdminDashboardData } = require('../controllers/adminController'); // <-- Assuming you put your getAdminDashboardData there

const router = express.Router();

// Admin dashboard data route
router.get('/dashboard', getAdminDashboardData);

module.exports = router;
