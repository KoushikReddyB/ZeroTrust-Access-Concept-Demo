import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Initialize fingerprintjs
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const fingerprint = result.visitorId;

      // 2. Fetch IP address (using a free service)
      const ipRes = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = ipRes.data.ip;

      // 3. Get basic browser details
      const browserDetails = navigator.userAgent;
      const deviceDetails = navigator.platform;

      // 4. Optional: dummy location (because you can't directly access GPS without permission)
      const location = {
        lat: 0,
        lon: 0
      };

      const loginPayload = {
        ...formData,
        fingerprint,
        ipAddress,
        location,
        browserDetails,
        deviceDetails
      };

      const res = await axios.post("http://localhost:5000/api/login", loginPayload);
      localStorage.setItem("token", res.data.token);
      alert("Login Successful!");
      navigate("/dashboard");
      
    } catch (error) {
      console.error(error.response?.data?.message);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
