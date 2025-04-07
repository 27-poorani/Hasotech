import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LeftNavigation from '../components/LeftNavigation';

const JobCandidates = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [candidates, setCandidates] = useState([
    { name: "John Doe", matchPercentage: 95 },
    { name: "Jane Smith", matchPercentage: 88 },
    { name: "Mike Johnson", matchPercentage: 85 },
    { name: "Sarah Williams", matchPercentage: 82 },
    { name: "Tom Brown", matchPercentage: 80 },
    { name: "Emily Davis", matchPercentage: 78 },
    { name: "David Wilson", matchPercentage: 75 },
    { name: "Lisa Anderson", matchPercentage: 73 },
    { name: "James Taylor", matchPercentage: 70 },
    { name: "Amy Martinez", matchPercentage: 68 }
  ]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user?.token;
        
        const response = await axios.post(`http://localhost:8000/jobs/${jobId}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  return (
    <div className="flex min-h-screen bg-white">
              <LeftNavigation />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-black">
            {job?.title || 'Loading...'} - Top Candidates
          </h1>
        
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {candidates.map((candidate, index) => (
              <div 
                key={index}
                className="p-4 border border-gray-200 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <span className="text-lg text-gray-800">{candidate.name}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  candidate.matchPercentage >= 85 ? 'bg-green-100 text-green-800' :
                  candidate.matchPercentage >= 75 ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {candidate.matchPercentage}% Match
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCandidates;