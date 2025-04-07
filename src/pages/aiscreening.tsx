import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LeftNavigation from '../components/LeftNavigation';
import axios from 'axios';

interface Job {
  _id: string;
  title: string;
  description: string;
  skillSet: string[];
  experience: string;
  recruiterEmail: string;
}

const AIScreening = () => {
  const navigate = useNavigate();
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  const fetchPostedJobs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await axios.get(`http://localhost:8000/jobs/recruiter/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setAvailableJobs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <LeftNavigation />
      <div className="flex-1 p-6 ml-64">
        <div className="p-6 rounded-lg" style={{ 
          background: 'white',
          border: '1px solid rgba(255, 215, 0, 0.1)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl" style={{ color: 'black' }}>Matched Candidates</h4>
          </div>
          {availableJobs.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {availableJobs.map((job) => (
                <div key={job._id} className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-all">
                  <div className="flex flex-col">
                    <h5 className="font-medium text-black text-lg mb-2">{job.title}</h5>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center text-gray-600">
                        <img src="/exp.png" alt="Experience" className="w-5 h-5 mr-2" />
                        <span className="text-sm">{job.experience}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skillSet.slice(0, 3).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skillSet.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{job.skillSet.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Recruiter Mail: {job.recruiterEmail}
                      </div>
                      
                      <div className="mt-4 border-t pt-3">
                        <h6 className="text-sm font-medium text-black mb-2">Top Matches</h6>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">John Doe</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              95% Match
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Jane Smith</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              88% Match
                            </span>
                          </div>
                          <button 
                                onClick={() => navigate(`/job-candidates/${job._id}`)}
                                className="w-full mt-2 px-3 py-1.5  bg-blue-100 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                           View All
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-500 mb-6 text-lg">No jobs posted yet</div>
              <button 
                onClick={() => navigate('/jobs')}
                className="px-8 py-4 bg-black text-white rounded-lg text-lg font-medium
                  transform hover:scale-105 transition-all duration-300 
                  animate-pulse hover:animate-none
                  shadow-lg hover:shadow-xl"
              >
                ✨ Post Your First Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIScreening;