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

import LeftNavigation from '../components/LeftNavigation';

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
    <div className="flex min-h-screen bg-black">
      <LeftNavigation />
      
      {/* Main Content */}
      <div className="flex-1 p-6 ml-64 pt-20">
        <div className="p-8 rounded-2xl w-full max-w-7xl mx-auto" style={{ 
          backgroundColor: '#242424',
          border: '1px solid #ffd700',
          boxShadow: '0 0 10px rgba(177, 150, 14, 0.2)'
        }}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: '#ffd700' }}>Posted Jobs</h1>
            <button
              onClick={() => navigate("/recruiter-dashboard")}
              className="px-4 py-2 rounded-lg hover:bg-gray-800"
              style={{
                backgroundColor: '#333',
                color: '#ffd700',
                border: '1px solid #ffd700'
              }}
            >
              Back to Dashboard
            </button>
          </div>

          {/* Add the edit form here */}
          {editJobId && (
            <div className="mt-4 space-y-4 mb-6">
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #ffd700'
                }}
                placeholder="Job Title"
                value={editJobTitle}
                onChange={(e) => setEditJobTitle(e.target.value)}
              />
              <textarea
                className="w-full px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #ffd700'
                }}
                placeholder="Job Description"
                value={editJobOverview}
                onChange={(e) => setEditJobOverview(e.target.value)}
              />
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #ffd700'
                }}
                placeholder="Experience Required"
                value={newJobExperience}
                onChange={(e) => setNewJobExperience(e.target.value)}
              />
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #ffd700'
                }}
                placeholder="Required Skills (comma separated)"
                value={editJobSkills}
                onChange={(e) => setEditJobSkills(e.target.value)}
              />
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #ffd700'
                }}
                placeholder="Recruiter Email"
                value={newRecruiterEmail}
                onChange={(e) => setNewRecruiterEmail(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateJob}
                  className="px-4 py-2 rounded-lg hover:bg-gray-800"
                  style={{
                    backgroundColor: '#333',
                    color: '#ffd700',
                    border: '1px solid #ffd700'
                  }}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditJobId(null);
                    setEditJobTitle('');
                    setEditJobSkills('');
                    setEditJobOverview('');
                    setNewJobExperience('');
                    setNewRecruiterEmail('');
                  }}
                  className="px-4 py-2 rounded-lg hover:bg-gray-800"
                  style={{
                    backgroundColor: '#333',
                    color: '#ffd700',
                    border: '1px solid #ffd700'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ borderColor: '#ffd700' }}>
              <thead>
                <tr style={{ backgroundColor: '#333' }}>
                  <th className="p-3 text-left" style={{ color: '#ffd700', borderColor: '#ffd700' }}>Job Title</th>
                  <th className="p-3 text-left" style={{ color: '#ffd700', borderColor: '#ffd700' }}>Description</th>
                  <th className="p-3 text-left" style={{ color: '#ffd700', borderColor: '#ffd700' }}>Experience</th>
                  <th className="p-3 text-left" style={{ color: '#ffd700', borderColor: '#ffd700' }}>Skills</th>
                  <th className="p-3 text-left" style={{ color: '#ffd700', borderColor: '#ffd700' }}>Recruiter</th>
                  <th className="p-3 text-left" style={{ color: '#ffd700', borderColor: '#ffd700' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-800" style={{ borderColor: '#ffd700' }}>
                    <td className="p-3" style={{ color: '#fff', borderColor: '#ffd700' }}>
                      {editJobId === job._id ? (
                        <input
                          type="text"
                          className="w-full px-2 py-1 rounded"
                          style={{ backgroundColor: '#333', color: '#fff', border: '1px solid #ffd700' }}
                          value={editJobTitle}
                          onChange={(e) => setEditJobTitle(e.target.value)}
                        />
                      ) : job.title}
                    </td>
                    <td className="p-3" style={{ color: '#fff', borderColor: '#ffd700' }}>
                      {editJobId === job._id ? (
                        <textarea
                          className="w-full px-2 py-1 rounded"
                          style={{ backgroundColor: '#333', color: '#fff', border: '1px solid #ffd700' }}
                          value={editJobOverview}
                          onChange={(e) => setEditJobOverview(e.target.value)}
                        />
                      ) : (job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description)}
                    </td>
                    <td className="p-3" style={{ color: '#fff', borderColor: '#ffd700' }}>
                      {editJobId === job._id ? (
                        <input
                          type="text"
                          className="w-full px-2 py-1 rounded"
                          style={{ backgroundColor: '#333', color: '#fff', border: '1px solid #ffd700' }}
                          value={newJobExperience}
                          onChange={(e) => setNewJobExperience(e.target.value)}
                        />
                      ) : job.experience}
                    </td>
                    <td className="p-3" style={{ color: '#fff', borderColor: '#ffd700' }}>
                      {editJobId === job._id ? (
                        <input
                          type="text"
                          className="w-full px-2 py-1 rounded"
                          style={{ backgroundColor: '#333', color: '#fff', border: '1px solid #ffd700' }}
                          value={editJobSkills}
                          onChange={(e) => setEditJobSkills(e.target.value)}
                        />
                      ) : job.skillSet.join(", ")}
                    </td>
                    <td className="p-3" style={{ color: '#fff', borderColor: '#ffd700' }}>
                      {editJobId === job._id ? (
                        <input
                          type="email"
                          className="w-full px-2 py-1 rounded"
                          style={{ backgroundColor: '#333', color: '#fff', border: '1px solid #ffd700' }}
                          value={newRecruiterEmail}
                          onChange={(e) => setNewRecruiterEmail(e.target.value)}
                        />
                      ) : job.recruiterEmail}
                    </td>
                    <td className="p-3" style={{ borderColor: '#ffd700' }}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(job._id)}
                          className="px-3 py-1 rounded hover:bg-gray-800"
                          style={{ backgroundColor: '#333', color: '#ffd700', border: '1px solid #ffd700' }}
                        >
                          View
                        </button>
                        {editJobId === job._id ? (
                          <>
                            <button
                              onClick={handleUpdateJob}
                              className="px-3 py-1 rounded hover:bg-gray-800"
                              style={{ backgroundColor: '#333', color: '#ffd700', border: '1px solid #ffd700' }}
                              disabled={loading}
                            >
                              {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => {
                                setEditJobId(null);
                                setEditJobTitle('');
                                setEditJobSkills('');
                                setEditJobOverview('');
                                setNewJobExperience('');
                                setNewRecruiterEmail('');
                              }}
                              className="px-3 py-1 rounded hover:bg-gray-800"
                              style={{ backgroundColor: '#333', color: '#ffd700', border: '1px solid #ffd700' }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => editJob(job)}
                              className="px-3 py-1 rounded hover:bg-gray-800"
                              style={{ backgroundColor: '#333', color: '#ffd700', border: '1px solid #ffd700' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(job._id)}
                              className="px-3 py-1 rounded hover:bg-gray-800"
                              style={{ backgroundColor: '#333', color: '#ffd700', border: '1px solid #ffd700' }}
                            >
                              Delete
                            </button>
                            <button
                              // onClick={() => handleDelete(job._id)}
                              className="px-3 py-1 rounded hover:bg-gray-800"
                              style={{ backgroundColor: '#333', color: '#ffd700', border: '1px solid #ffd700' }}
                            >
                              Publish Job to Naukri
                            </button>
                            
                          </>
                          
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewJobs;
