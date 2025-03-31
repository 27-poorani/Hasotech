import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/login";
import Home from "./pages/home";
import ResetPassword from './pages/RecruiterDashboard';
import Dashboard from "./pages/Dashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import InterviewerDashboard from "./pages/InterviewerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import JobManagement from "./pages/JobManagement";
import LearnMore from "./pages/LearnMore";
import Profile from "./pages/Profile";
import ViewJobs from "./pages/viewjobs";
import ResumeScreen from "./pages/ResumeScreen";
import AIScreening from './pages/aiscreening';
import ForgotPassword from './pages/forgotpassword';
import EditJob from './pages/editjob';
import JobView from './pages/JobView';
import ScheduleInterview from "./pages/ScheduleInterview";




function App() {
  return (
    <div className="flex flex-col min-h-screen">
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
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/viewjobs" element={<ViewJobs />} />
          <Route path="/resumescreen" element={<ResumeScreen />} />
          <Route path="/ai-screening" element={<AIScreening />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset" element={<ResetPassword />} />
          <Route path="/jobs/edit/:jobId" element={<EditJob />} />
          <Route path="/job-view/:jobId" element={<JobView />} />
          <Route path="/schedule-interview/:candidateId?" element={<ScheduleInterview />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
