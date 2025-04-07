import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LeftNavigation from '../components/LeftNavigation';

// Update the Job interface first
interface Job {
  _id: string;
  title: string;
  description: string;
  recruiterEmail: string;
  skillSet: string[];
  experience: string;
  noticePeriod: string;
  technicalKnowledge: string[];
  attitudeRequired: string;
  numberOfRounds: number;
  panelists: {
    [key: string]: {
      email: string;
      phoneNumber: string;
    };
  };
}

const JobView = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user?.token;

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const fetchJobDetails = async () => {
    try {
      console.log("Fetching job with ID:", jobId);

      const userinLocalStorage = localStorage.getItem("user");
      const user = userinLocalStorage ? JSON.parse(userinLocalStorage) : []
      const token = user.token;

      console.log("Token:", token);
      console.log("Job Id", jobId);
      
      const response = await axiosInstance.post(`/jobs/${jobId}`);
      setJob(response.data);

    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-xl text-gray-700">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-xl text-red-600">{error}</div>
    </div>
  );

  if (!job) return null;

  return (
    <div className="flex min-h-screen bg-white">
      <LeftNavigation />
      
      <div className="flex-1 p-6 ml-64">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-semibold text-black">{job.title}</h1>
        
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>

            {/* Experience and Notice Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Experience Required</h2>
                <p className="text-gray-700">{job.experience}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Notice Period</h2>
                <p className="text-gray-700">{job.noticePeriod}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillSet?.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Knowledge */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Technical Knowledge</h2>
              <div className="flex flex-wrap gap-2">
                {job.technicalKnowledge?.map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Attitude Requirements */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Attitude Requirements</h2>
              <p className="text-gray-700">{job.attitudeRequired}</p>
            </div>

            {/* Interview Process */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Interview Process</h2>
              <p className="text-gray-700 mb-4">Number of Rounds: {job.numberOfRounds}</p>
              
              <div className="space-y-4">
                {[...Array(job.numberOfRounds)].map((_, index) => {
                  const roundKey = `round${index + 1}`;
                  const panelist = job.panelists[roundKey];
                  
                  return (
                    <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Round {index + 1} Panelist</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600">Email: </span>
                          <a href={`mailto:${panelist?.email}`} className="text-blue-600 hover:underline">
                            {panelist?.email}
                          </a>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone: </span>
                          <a href={`tel:${panelist?.phoneNumber}`} className="text-blue-600 hover:underline">
                            {panelist?.phoneNumber}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Contact Information</h2>
              <div className="flex items-center space-x-3">
                <span className="text-gray-600">Recruiter Email:</span>
                <a href={`mailto:${job.recruiterEmail}`} className="text-blue-600 hover:underline">
                  {job.recruiterEmail}
                </a>
              </div>
            </div>
            <h4 className="text-xl p-6 " style={{ color: 'black' }}>Job Portal Distribution</h4>
  <div className="space-y-2 p-6">
    <label className="flex items-center space-x-3">
      <input
        type="checkbox"
        className="w-4 h-4 border-2 border-black rounded "
       
      />
      <span className="text-black">LinkedIn</span>
    </label>
    <label className="flex items-center space-x-3">
      <input
        type="checkbox"
        className="w-4 h-4 border-2 border-black rounded"
      />
      <span className="text-black">Indeed</span>
    </label>
    <label className="flex items-center space-x-3">
      <input
        type="checkbox"
        className="w-4 h-4 border-2 border-black rounded"
      />
      <span className="text-black">Naukri</span>
    </label>
    <label className="flex items-center space-x-3">
      <input
        type="checkbox"
        className="w-4 h-4 border-2 border-black rounded"
      />
      <span className="text-black">Monster</span>
    </label><br></br>
    <button
                onClick={() => navigate("/recruiter-dashboard")}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700"
              >
                Post Job to Selected Portals
              </button>
    </div>
    
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobView;
