import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminDash from './pages/AdminDash';
import UserDash from './pages/UserDash';
import DevicedApproval from './pages/DeviceApproval';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/dash" element={<UserDash />} />
        <Route path="/admin-dash" element={<AdminDash />} />
        <Route path="/dev-app" element={<DevicedApproval />} />
      </Routes>
    </Router>
  );
}

export default App;