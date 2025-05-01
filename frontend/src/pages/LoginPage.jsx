import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

function LoginPage() {
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setError(""); // Clear error when user types
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const fingerprint = result.visitorId;
      const ipRes = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = ipRes.data.ip;
      const browserDetails = navigator.userAgent;
      const deviceDetails = navigator.platform;

      let locationData = { lat: 0, lon: 0 };

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000
          });
        });

        locationData = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
      } catch (geoError) {
        console.log("Using IP-based location due to:", geoError.message);
        const ipLocationRes = await axios.get('https://ipapi.co/json/');
        locationData = {
          lat: ipLocationRes.data.latitude,
          lon: ipLocationRes.data.longitude
        };
      }

      const loginPayload = {
        ...formData,
        fingerprint,
        ipAddress,
        location: locationData,
        browserDetails,
        deviceDetails
      };

      const apiUrl = location.pathname.includes("/admin/login")
        ? "http://localhost:5000/api/admin/login"
        : "http://localhost:5000/api/login";

      const res = await axios.post(apiUrl, loginPayload);

      localStorage.setItem("token", res.data.token);

      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-2xl font-bold text-center mb-6">
          {location.pathname.includes("/admin/login") ? "Admin Login" : "Login"}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.password}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;