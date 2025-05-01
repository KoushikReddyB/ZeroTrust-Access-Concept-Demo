import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingAnimation from '../components/LoadingAnimation';
import { 
  Shield, AlertTriangle, Users, Clock, Globe, 
  Server, Lock, Activity, MonitorSmartphone, 
  FileText, ArrowUpRight, ArrowDownRight, 
  ArrowRight, RefreshCw
} from 'lucide-react';

// Mock data generator
const generateMockData = () => {
  return {
    activeUsers: Math.floor(Math.random() * 50) + 150,
    activeSessions: Math.floor(Math.random() * 100) + 300,
    accessAttempts: Math.floor(Math.random() * 20) + 80,
    blockedAccess: Math.floor(Math.random() * 10) + 5,
    availableApps: 42,
    networkLatency: Math.floor(Math.random() * 50) + 20,
    deviceCompliance: Math.floor(Math.random() * 10) + 90,
    userLocations: [
      { name: 'United States', count: Math.floor(Math.random() * 50) + 100 },
      { name: 'United Kingdom', count: Math.floor(Math.random() * 20) + 30 },
      { name: 'Germany', count: Math.floor(Math.random() * 15) + 20 },
      { name: 'India', count: Math.floor(Math.random() * 25) + 40 },
      { name: 'Australia', count: Math.floor(Math.random() * 10) + 15 }
    ],
    securityAlerts: [
      { id: 1, severity: 'high', message: 'Multiple failed login attempts', time: '2 mins ago' },
      { id: 2, severity: 'medium', message: 'Unusual access pattern detected', time: '15 mins ago' },
      { id: 3, severity: 'low', message: 'Device compliance warning', time: '34 mins ago' },
      { id: 4, severity: 'high', message: 'Possible credential sharing', time: '58 mins ago' }
    ],
    recentActivity: [
      { id: 1, user: 'sarah.johnson', action: 'Accessed Sales CRM', time: '1 min ago' },
      { id: 2, user: 'alex.patel', action: 'Downloaded financial report', time: '5 mins ago' },
      { id: 3, user: 'james.wong', action: 'Logged in from new device', time: '12 mins ago' },
      { id: 4, user: 'maria.garcia', action: 'Accessed HR portal', time: '17 mins ago' }
    ]
  };
};

const MetricCard = ({ title, value, icon, trend, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
    purple: "bg-purple-50 text-purple-700"
  };

  const trendIcon = trend === 'up' ? 
    <ArrowUpRight size={16} className="text-green-500" /> : 
    trend === 'down' ? 
    <ArrowDownRight size={16} className="text-red-500" /> : 
    <ArrowRight size={16} className="text-gray-500" />;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="flex items-center">
          {trendIcon}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};

const AlertItem = ({ alert }) => {
  const severityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800"
  };

  return (
    <div className="flex items-center border-b border-gray-100 py-2">
      <div className={`px-2 py-1 rounded text-xs font-medium mr-3 ${severityColors[alert.severity]}`}>
        {alert.severity}
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium">{alert.message}</p>
      </div>
      <div className="text-xs text-gray-500">{alert.time}</div>
    </div>
  );
};

const ActivityItem = ({ activity }) => {
  return (
    <div className="flex items-center border-b border-gray-100 py-2">
      <div className="flex-grow">
        <p className="text-sm font-medium">{activity.user}</p>
        <p className="text-xs text-gray-500">{activity.action}</p>
      </div>
      <div className="text-xs text-gray-500">{activity.time}</div>
    </div>
  );
};

const LocationItem = ({ location }) => {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm">{location.name}</span>
      <span className="text-sm font-medium">{location.count}</span>
    </div>
  );
};

const AdminDash = () => {
  const [data, setData] = useState(generateMockData());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [pendingDevices, setPendingDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    }
  };

  const fetchPendingDevices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/devices/pending', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setPendingDevices(response.data.devices || []);
    } catch (error) {
      console.error("Error fetching pending devices:", error);
      setError("Failed to fetch pending devices");
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceApproval = async (userId, deviceId, approved) => {
    try {
      const endpoint = approved ? 'approve' : 'deny';
      await axios.put(
        `http://localhost:5000/api/admin/device/${endpoint}/${userId}/${deviceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      fetchPendingDevices();
    } catch (error) {
      console.error("Error handling device approval:", error);
      setError(`Failed to ${approved ? 'approve' : 'deny'} device`);
    }
  };

  const handleUserToggle = async (userId, disabled) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/status`,
        { disabled },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
      setError("Failed to update user status");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPendingDevices();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setData(generateMockData());
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 1000);
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ZTNA Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <button 
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Active Users" 
          value={data.activeUsers} 
          icon={<Users size={20} />} 
          trend="up" 
          color="blue"
        />
        <MetricCard 
          title="Active Sessions" 
          value={data.activeSessions} 
          icon={<MonitorSmartphone size={20} />} 
          trend="up" 
          color="green"
        />
        <MetricCard 
          title="Access Attempts" 
          value={data.accessAttempts} 
          icon={<Activity size={20} />} 
          trend="neutral" 
          color="purple"
        />
        <MetricCard 
          title="Blocked Access" 
          value={data.blockedAccess} 
          icon={<Shield size={20} />} 
          trend="down" 
          color="red"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard 
          title="Available Applications" 
          value={data.availableApps} 
          icon={<Server size={20} />} 
          trend="neutral" 
          color="blue"
        />
        <MetricCard 
          title="Avg Network Latency" 
          value={`${data.networkLatency}ms`} 
          icon={<Clock size={20} />} 
          trend="up" 
          color="yellow"
        />
        <MetricCard 
          title="Device Compliance" 
          value={`${data.deviceCompliance}%`} 
          icon={<Lock size={20} />} 
          trend="down" 
          color="green"
        />
      </div>

      {/* Device Approvals */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center mb-4">
          <MonitorSmartphone size={20} className="text-blue-500 mr-2" />
          <h2 className="text-lg font-bold">Pending Device Approvals</h2>
        </div>
        <div className="space-y-2">
          {pendingDevices.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending device approvals</p>
          ) : (
            pendingDevices.map((device) => (
              <div key={device._id} className="flex items-center justify-between border-b border-gray-100 py-2">
                <div>
                  <p className="font-medium">{device.deviceDetails}</p>
                  <p className="text-sm text-gray-500">User: {device.userEmail}</p>
                  <p className="text-sm text-gray-500">Browser: {device.browserDetails}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeviceApproval(device.userId, device._id, true)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDeviceApproval(device.userId, device._id, false)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Alerts */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-4">
            <AlertTriangle size={20} className="text-red-500 mr-2" />
            <h2 className="text-lg font-bold">Security Alerts</h2>
          </div>
          <div className="space-y-1">
            {data.securityAlerts.map(alert => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-4">
            <FileText size={20} className="text-blue-500 mr-2" />
            <h2 className="text-lg font-bold">Recent Activity</h2>
          </div>
          <div className="space-y-1">
            {data.recentActivity.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* User Locations */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-4">
            <Globe size={20} className="text-green-500 mr-2" />
            <h2 className="text-lg font-bold">User Locations</h2>
          </div>
          <div className="space-y-2">
            {data.userLocations.map((location, index) => (
              <LocationItem key={index} location={location} />
            ))}
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <div className="flex items-center mb-4">
          <Users size={20} className="text-blue-500 mr-2" />
          <h2 className="text-lg font-bold">User Management</h2>
        </div>
        <div className="space-y-4">
          {users.map(user => (
            <div key={user._id} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => handleUserToggle(user._id, !user.disabled)}
                className={`px-4 py-2 text-white rounded ${user.disabled ? 'bg-green-500' : 'bg-red-500'}`}
              >
                {user.disabled ? 'Enable' : 'Disable'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
