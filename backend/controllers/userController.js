const User = require('../models/User');
const Session = require('../models/Session');

exports.getUserDevices = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const activeSessions = await Session.find({
      userId: req.user.id,
      isActive: true
    }).select('deviceDetails location loginTime lastActivity');

    res.status(200).json({
      devices: user.devices,
      activeSessions
    });
  } catch (error) {
    console.error('Error fetching user devices:', error);
    res.status(500).json({ message: "Error fetching devices" });
  }
};