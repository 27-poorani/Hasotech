import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

interface Job {
  _id: string;
  title: string;
  description: string;
  experience: string;
  skillSet: string[];
  recruiterEmail: string;
  applicants?: number;
}


const ViewJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [editJobTitle, setEditJobTitle] = useState("");
  const [editJobSkills, setEditJobSkills] = useState("");
  const [editJobOverview, setEditJobOverview] = useState("");
  const [newJobExperience, setNewJobExperience] = useState("");
  const [newRecruiterEmail, setNewRecruiterEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      
      const response = await axios.get(`http://localhost:8000/jobs/recruiter/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const editJob = (job: Job) => {
    setEditJobId(job._id);
    setEditJobTitle(job.title);
    setEditJobSkills(job.skillSet.join(", "));
    setEditJobOverview(job.description);
    setNewJobExperience(job.experience);
    setNewRecruiterEmail(job.recruiterEmail);
  };

  const handleUpdateJob = async () => {
    if (!editJobId) return;
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;
      
      if (!token) {
        alert('Please login again');
        return;
      }
      
      const response = await axios.put(`http://localhost:8000/jobs/update/${editJobId}`, {
        title: editJobTitle,
        description: editJobOverview,
        skillSet: editJobSkills.split(',').map(skill => skill.trim()),
        experience: newJobExperience,
        recruiterEmail: newRecruiterEmail
      }, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      
      if (response.data.success) {
        alert('Job updated successfully!');
        setEditJobId(null);
        setEditJobTitle('');
        setEditJobSkills('');
        setEditJobOverview('');
        setNewJobExperience('');
        setNewRecruiterEmail('');
        fetchJobs();
      }
    } catch (error: any) {
      console.error('Error updating job:', error);
      alert(error.response?.data?.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (jobId: string) => {
    navigate(`/job-view/${jobId}`);
  };

  // Add this function after handleView and before return statement
  const handleDelete = async (jobId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?');
    if (!confirmDelete) return;
  
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;
      
      if (!token) {
        alert('Please login again');
        return;
      }
      
      const response = await axios.delete(`http://localhost:8000/jobs/delete/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('Job deleted successfully!');
        fetchJobs();
      }
    } catch (error: any) {
      console.error('Error deleting job:', error);
      alert(error.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <div className="flex min-h-screen bg-white" style={{ marginLeft: '0px' }}>
      {/* Left Navigation */}
      <div className="w-64 min-h-screen bg-white p-4 border-r border-gray-200 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-4">
        <img src="/aimnbbnm.jpg" alt="AIRecruiterX" className="w-25 h-8" />
      </div>
      <div className="text-gray-600 text-xs mb-6">RECRUITMENT</div>

        <nav className="space-y-2">
          <div className="p-3 rounded-lg bg-black">
            <a href="/dashboard" className="flex items-center text-white">
              <span className="mr-3">⬚</span>
              Dashboard
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/jobs" className="flex items-center text-gray-400">
              <span className="mr-3">📋</span>
              Jobs
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/ai-screening" className="flex items-center text-gray-400">
              <span className="mr-3">👥</span>
              Candidates
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/resumescreen" className="flex items-center text-gray-400">
              <span className="mr-3">🔍</span>
              Screening
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/schedule-interview" className="flex items-center text-gray-400">
              <span className="mr-3">💬</span>
              Interviews
            </a>
          </div>
          
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Posted Jobs</h1>
          <button 
            onClick={() => navigate("/jobs")} 
            className="px-4 py-2 rounded-lg bg-black text-white"
          >
            Create New Job
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Job Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Experience</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Skills</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Recruiter</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{job.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.experience}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {job.skillSet.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.recruiterEmail}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(job._id)}
                        className="px-3 py-1 text-sm rounded-lg bg-black text-white hover:bg-gray-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/jobs/edit/${job._id}`)}
                        className="px-3 py-1 text-sm rounded-lg bg-black text-white hover:bg-gray-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="px-3 py-1 text-sm rounded-lg border border-red-500 text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewJobs;
