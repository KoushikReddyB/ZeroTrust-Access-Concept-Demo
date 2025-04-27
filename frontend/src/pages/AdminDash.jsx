import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/dashboard");
        setDashboardData(res.data);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  const { activeUsers, activeSessions, accessAttempts, blockedAccess, availableApplications, avgNetworkLatency, deviceComplianceRate, recentAlerts, userLocations, recentActivity } = dashboardData;

  // Prepare user location data for chart
  const locationLabels = userLocations.map(location => location._id);
  const locationData = userLocations.map(location => location.count);

  const locationChartData = {
    labels: locationLabels,
    datasets: [
      {
        label: "User Locations",
        data: locationData,
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h1>ZTNA Admin Dashboard</h1>
      <p>Last updated: {new Date().toLocaleTimeString()}</p>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
        <div>
          <h2>Active Users</h2>
          <p>{activeUsers}</p>
        </div>
        <div>
          <h2>Active Sessions</h2>
          <p>{activeSessions}</p>
        </div>
        <div>
          <h2>Access Attempts</h2>
          <p>{accessAttempts}</p>
        </div>
        <div>
          <h2>Blocked Access</h2>
          <p>{blockedAccess}</p>
        </div>
      </div>

      <div>
        <h2>Recent Security Alerts</h2>
        <ul>
          {recentAlerts.map(alert => (
            <li key={alert._id}>
              {alert.level} - {alert.message} ({new Date(alert.createdAt).toLocaleTimeString()})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Device Compliance</h2>
        <p>{deviceComplianceRate}% compliant devices</p>
      </div>

      <div>
        <h2>Location-Based User Metrics</h2>
        <Line data={locationChartData} />
      </div>

      <div>
        <h2>Recent Activity</h2>
        <ul>
          {recentActivity.map(activity => (
            <li key={activity._id}>
              {activity.user} accessed {activity.resource} at {new Date(activity.timestamp).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
