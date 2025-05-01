import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeviceApproval({ userId }) {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // Fetch devices for the user (userId)
        const response = await axios.get(`/api/admin/users/${userId}/devices`);
        setDevices(response.data.devices);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, [userId]);

  const approveDevice = async (deviceId) => {
    try {
      await axios.put(`/api/admin/device/approve/${userId}/${deviceId}`);
      // Update the state to show device as approved
      setDevices(devices.map(device => 
        device._id === deviceId ? { ...device, approved: true } : device
      ));
    } catch (error) {
      console.error('Error approving device:', error);
    }
  };

  const denyDevice = async (deviceId) => {
    try {
      await axios.put(`/api/admin/device/deny/${userId}/${deviceId}`);
      // Update the state to show device as denied
      setDevices(devices.map(device => 
        device._id === deviceId ? { ...device, approved: false } : device
      ));
    } catch (error) {
      console.error('Error denying device:', error);
    }
  };

  return (
    <div>
      <h3>Device Approval</h3>
      <ul>
        {devices.map(device => (
          <li key={device._id}>
            <div>
              <p><strong>Device Details:</strong> {device.deviceDetails}</p>
              <p><strong>Status:</strong> {device.approved ? 'Approved' : 'Pending'}</p>
              <button onClick={() => approveDevice(device._id)} disabled={device.approved}>Approve</button>
              <button onClick={() => denyDevice(device._id)} disabled={!device.approved}>Deny</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeviceApproval;
