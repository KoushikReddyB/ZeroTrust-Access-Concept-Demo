const User = require('../models/User');
const Session = require('../models/Session'); // Assuming you have a session model
const ActivityLog = require('../models/ActivityLog'); // Assuming you have an activity log model
const SecurityAlert = require('../models/SecurityAlert'); // Security alerts collection

// Get Admin Dashboard Data
exports.getAdminDashboardData = async (req, res) => {
  try {
    // Active Users
    const activeUsers = await User.find({ isActive: true }).countDocuments();
    
    // Active Sessions
    const activeSessions = await Session.find({ isActive: true }).countDocuments();

    // Access Attempts
    const accessAttempts = await ActivityLog.find({ action: 'attempt' }).countDocuments();

    // Blocked Access
    const blockedAccess = await SecurityAlert.find({ level: 'high' }).countDocuments(); // High-level alerts

    // Available Applications (example)
    const availableApplications = 42;

    // Avg Network Latency (Dummy data or calculate from your logs)
    const avgNetworkLatency = 40;

    // Device Compliance
    const compliantDevices = await User.find({ deviceCompliant: true }).countDocuments();
    const totalDevices = await User.countDocuments();
    const deviceComplianceRate = (compliantDevices / totalDevices) * 100;

    // Security Alerts (sample recent alerts)
    const recentAlerts = await SecurityAlert.find().sort({ createdAt: -1 }).limit(5); 

    // User Locations
    const userLocations = await User.aggregate([
      { $group: { _id: "$location.country", count: { $sum: 1 } } }
    ]);

    // Recent Activity (example)
    const recentActivity = await ActivityLog.find().sort({ timestamp: -1 }).limit(5);

    // Returning the collected data
    res.status(200).json({
      activeUsers,
      activeSessions,
      accessAttempts,
      blockedAccess,
      availableApplications,
      avgNetworkLatency,
      deviceComplianceRate,
      recentAlerts,
      userLocations,
      recentActivity
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
