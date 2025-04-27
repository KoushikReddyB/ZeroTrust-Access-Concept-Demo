import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

function LoginPage() {
  const location = useLocation(); 
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const fingerprint = result.visitorId;
      const ipRes = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = ipRes.data.ip;
      const browserDetails = navigator.userAgent;
      const deviceDetails = navigator.platform;

      let locationData = { lat: 0, lon: 0 };

      // Ask user nicely
      const userConsent = window.confirm(
        "We need your location to permit the device securely.\nIf you deny, we'll use your IP-based location."
      );

      if (userConsent) {
        try {
          locationData = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                resolve({
                  lat: pos.coords.latitude,
                  lon: pos.coords.longitude
                });
              },
              (err) => {
                console.error("GPS location error", err);
                reject(err);
              },
              { enableHighAccuracy: true, timeout: 10000 }
            );
          });
        } catch (geoError) {
          console.error("Falling back to IP location due to GPS error");
          const ipLocationRes = await axios.get('https://ipapi.co/json/');
          locationData = {
            lat: ipLocationRes.data.latitude,
            lon: ipLocationRes.data.longitude
          };
        }
      } else {
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

      alert("Login Successful!");

      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
        /><br /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
        /><br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
