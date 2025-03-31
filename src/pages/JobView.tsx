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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'black' }}>
      <div className="text-xl" style={{ color: '#ffd700' }}>Loading...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'black' }}>
      <div className="text-xl" style={{ color: '#ffd700' }}>{error}</div>
    </div>
  );

  if (!job) return null;

  return (
    <div className="flex min-h-screen bg-black">
      <LeftNavigation />
      
      <div className="flex-1 p-8 ml-64 pt-20">
        <div className="max-w-4xl mx-auto p-8 rounded-lg" style={{ 
          backgroundColor: '#242424',
          border: '2px solid #ffd700',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.15)'
        }}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight" style={{ 
              color: '#ffd700',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
            }}>{job.title}</h1>
            <button
              onClick={() => navigate("/recruiter-dashboard")}
              className="px-6 py-3 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:scale-105"
              style={{
                backgroundColor: '#333',
                color: '#ffd700',
                border: '1px solid #ffd700',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.1)'
              }}
            >
              Back to Dashboard
            </button>
          </div>
  
          <div className="space-y-6">
            {/* Description */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(51, 51, 51, 0.5)' }}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: '#ffd700' }}>Description</h2>
              <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
  
            {/* Experience and Notice Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(51, 51, 51, 0.5)' }}>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#ffd700' }}>Experience Required</h2>
                <p className="text-white text-lg">{job.experience}</p>
              </div>

              <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(51, 51, 51, 0.5)' }}>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#ffd700' }}>Notice Period</h2>
                <p className="text-white text-lg">{job.noticePeriod}</p>
              </div>
            </div>
  
            {/* Skills */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(51, 51, 51, 0.5)' }}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: '#ffd700' }}>Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {job.skillSet?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-lg text-base transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: '#333',
                      color: '#ffd700',
                      border: '1px solid #ffd700',
                      boxShadow: '0 0 10px rgba(255, 215, 0, 0.1)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Knowledge */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(51, 51, 51, 0.5)' }}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: '#ffd700' }}>Technical Knowledge</h2>
              <div className="flex flex-wrap gap-3">
                {job.technicalKnowledge?.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-lg text-base transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: '#333',
                      color: '#ffd700',
                      border: '1px solid #ffd700',
                      boxShadow: '0 0 10px rgba(255, 215, 0, 0.1)'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Attitude Requirements */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(51, 51, 51, 0.5)' }}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: '#ffd700' }}>Attitude Requirements</h2>
              <p className="text-white text-lg">{job.attitudeRequired}</p>
            </div>

            {/* Interview Rounds */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(51, 51, 51, 0.5)' }}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: '#ffd700' }}>Interview Process</h2>
              <p className="text-white text-lg mb-4">Number of Rounds: {job.numberOfRounds}</p>
              
              <div className="space-y-4">
                {[...Array(job.numberOfRounds)].map((_, index) => {
                  const roundKey = `round${index + 1}`;
                  const panelist = job.panelists[roundKey];
                  
                  return (
                    <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(51, 51, 51, 0.7)' }}>
                      <h3 className="text-xl font-medium mb-3" style={{ color: '#ffd700' }}>
                        Round {index + 1} Panelist
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-white">Email: </span>
                          <a 
                            href={`mailto:${panelist?.email}`}
                            className="text-gold hover:underline"
                            style={{ color: '#ffd700' }}
                          >
                            {panelist?.email}
                          </a>
                        </div>
                        <div>
                          <span className="text-white">Phone: </span>
                          <a 
                            href={`tel:${panelist?.phoneNumber}`}
                            className="text-gold hover:underline"
                            style={{ color: '#ffd700' }}
                          >
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
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(51, 51, 51, 0.5)' }}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: '#ffd700' }}>Contact Information</h2>
              <div className="flex items-center space-x-3">
                <span className="text-white text-lg">Recruiter Email:</span>
                <a 
                  href={`mailto:${job.recruiterEmail}`} 
                  className="text-lg transition-all duration-300 hover:scale-105"
                  style={{
                    color: '#ffd700',
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(255, 215, 0, 0.5)'
                  }}
                >
                  {job.recruiterEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobView;
