import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecruiterDashboard from "./RecruiterDashboard";
import InterviewerDashboard from "./InterviewerDashboard";
import AdminDashboard from "./AdminDashboard";



const Dashboard = () => {
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user role from localStorage (Replace with API call in real apps)
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user && user.role) {
      setRole(user.role.toLowerCase()); // Ensure role is in lowercase for consistency
    } else {
      navigate("/login"); // Redirect to login if no role is found
    }
  }, [navigate]);

  // Redirect based on role
  if (role === "recruiter") return <RecruiterDashboard />;
  if (role === "interviewer") return <InterviewerDashboard />;
  if (role === "admin") return <AdminDashboard />;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600 text-lg">Loading dashboard...</p>
    </div>
  );
};

export default Dashboard;
