import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';
import LoadingAnimation from '../components/LoadingAnimation';

function DeviceApproval() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/devices/pending', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setDevices(response.data.devices || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching devices:', error);
        setError('Failed to fetch pending devices');
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const handleDeviceAction = async (userId, deviceId, approved) => {
    try {
      const action = approved ? 'approve' : 'deny';
      await axios.put(
        `http://localhost:5000/api/admin/device/${action}/${userId}/${deviceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setDevices(devices.filter(device => device._id !== deviceId));
    } catch (error) {
      console.error('Error handling device action:', error);
      setError(`Failed to ${approved ? 'approve' : 'deny'} device`);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center mb-8">
          <Shield className="w-8 h-8 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-slate-100">Device Approval</h1>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-100 p-4 rounded-lg mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {devices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <p className="text-slate-400">No pending devices to approve</p>
            </motion.div>
          ) : (
            devices.map((device, index) => (
              <motion.div
                key={device._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{device.deviceDetails}</h3>
                    <p className="text-slate-400 mt-1">User: {device.userEmail}</p>
                    <p className="text-slate-400">Browser: {device.browserDetails}</p>
                    {device.location && (
                      <p className="text-slate-400">
                        Location: {device.location.lat}, {device.location.lon}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDeviceAction(device.userId, device._id, true)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeviceAction(device.userId, device._id, false)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default DeviceApproval;