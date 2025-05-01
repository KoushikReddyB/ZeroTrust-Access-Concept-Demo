import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingAnimation from '../components/LoadingAnimation';

const UserDash = () => {
  const [userMetrics, setUserMetrics] = useState({
    activeSessions: [],
    devices: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserMetrics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/metrics', { 
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        }
      });
      setUserMetrics(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user metrics:", error);
      setError("Failed to fetch user data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMetrics();
    const interval = setInterval(fetchUserMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
        <p className="text-sm text-gray-500">Device and Session Management</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Sessions</h2>
        <div className="device-list">
          {userMetrics.activeSessions?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No active sessions
            </div>
          ) : (
            userMetrics.activeSessions?.map((session, index) => (
              <div key={index} className="device-item">
                <div>
                  <p className="font-medium text-gray-900">{session.deviceDetails}</p>
                  <p className="text-sm text-gray-500">
                    Last activity: {new Date(session.lastActivity).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Location: {session.location ? `${session.location.lat}, ${session.location.lon}` : 'Unknown'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Registered Devices</h2>
        <div className="device-list">
          {userMetrics.devices?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No registered devices
            </div>
          ) : (
            userMetrics.devices?.map((device, index) => (
              <div key={index} className="device-item">
                <div>
                  <p className="font-medium text-gray-900">{device.deviceDetails}</p>
                  <p className="text-sm text-gray-500">Browser: {device.browserDetails}</p>
                  <p className="text-sm text-gray-500">
                    Last used: {device.lastUsed ? new Date(device.lastUsed).toLocaleString() : 'Never'}
                  </p>
                </div>
                <div>
                  <span className={`badge ${device.approved ? 'badge-success' : 'badge-pending'}`}>
                    {device.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDash;