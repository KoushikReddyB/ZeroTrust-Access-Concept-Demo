const User = require('../models/User');
const Session = require('../models/Session');
const ActivityLog = require('../models/ActivityLog');
const SecurityAlert = require('../models/SecurityAlert');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('fullName email role department disabled devices')
      .sort({ createdAt: -1 });

    res.status(200).json({ users });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Toggle user status (enable/disable)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { disabled } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.disabled = disabled;
    await user.save();

    if (disabled) {
      // Revoke all active sessions
      await Session.updateMany(
        { userId, isActive: true },
        { 
          isActive: false,
          revokedAt: new Date(),
          revokedBy: req.user.id,
          revokedReason: 'Account disabled by admin'
        }
      );
    }

    await ActivityLog.create({
      user: req.user.id,
      action: disabled ? 'user_disabled' : 'user_enabled',
      details: `${disabled ? 'Disabled' : 'Enabled'} user: ${user.email}`,
      ipAddress: req.ip
    });

    res.status(200).json({
      message: `User ${disabled ? 'disabled' : 'enabled'} successfully`,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        disabled: user.disabled
      }
    });
  } catch (error) {
    console.error('User Status Toggle Error:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
};

// Get pending devices
exports.getPendingDevices = async (req, res) => {
  try {
    const users = await User.find({ 'devices.approved': false });
    const pendingDevices = users.reduce((devices, user) => {
      const userPendingDevices = user.devices
        .filter(device => !device.approved)
        .map(device => ({
          ...device.toObject(),
          userId: user._id,
          userEmail: user.email
        }));
      return [...devices, ...userPendingDevices];
    }, []);

    res.json({ devices: pendingDevices });
  } catch (error) {
    console.error('Error fetching pending devices:', error);
    res.status(500).json({ message: 'Error fetching pending devices' });
  }
};

// Approve device
exports.approveDevice = async (req, res) => {
  const { userId, deviceId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const device = user.devices.id(deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.approved = true;
    await user.save();

    await ActivityLog.create({
      user: req.user.id,
      action: 'device_approval',
      resource: `Device ${deviceId}`,
      details: `Device approved for user: ${user.email}`
    });

    return res.status(200).json({ 
      message: 'Device approved successfully',
      device: device
    });
  } catch (error) {
    console.error('Device Approval Error:', error);
    return res.status(500).json({ message: 'Error approving device' });
  }
};

// Deny device
exports.denyDevice = async (req, res) => {
  const { userId, deviceId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const device = user.devices.id(deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.approved = false;
    await user.save();

    await ActivityLog.create({
      user: req.user.id,
      action: 'device_denial',
      resource: `Device ${deviceId}`,
      details: `Device denied for user: ${user.email}`
    });

    return res.status(200).json({ 
      message: 'Device denied successfully',
      device: device
    });
  } catch (error) {
    console.error('Device Denial Error:', error);
    return res.status(500).json({ message: 'Error denying device' });
  }
};