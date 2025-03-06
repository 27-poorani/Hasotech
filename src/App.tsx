import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import InterviewerDashboard from "./pages/InterviewerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import JobManagement from "./pages/JobManagement";
import JobDetails from "./pages/JobDetails";
import LearnMore from "./pages/learnmore";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/interviewer-dashboard" element={<InterviewerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/jobs" element={<JobManagement />} />
          <Route path="/job-details/:id" element={<JobDetails />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/profile" element={<Profile />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
