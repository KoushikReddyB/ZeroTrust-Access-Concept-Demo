import { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    department: "",
    role: "user",
  });
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", formData);
      alert("OTP Sent to your Email.");
      setStep(2);
    } catch (error) {
      console.error(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/verify-otp", { ...formData, otp });
      alert("Registration Successful!");
      // Redirect to login page later
    } catch (error) {
      console.error(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {step === 1 ? (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required /><br /><br />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br /><br />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br /><br />
          <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required /><br /><br />
          <input type="text" name="department" placeholder="Department" onChange={handleChange} required /><br /><br />
          <select name="role" onChange={handleChange}>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select><br /><br />
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleOtpVerify}>
          <h2>Verify OTP</h2>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required /><br /><br />
          <button type="submit">Verify & Register</button>
        </form>
      )}
    </div>
  );
}

export default RegisterPage;
