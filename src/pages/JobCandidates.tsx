import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LeftNavigation from '../components/LeftNavigation';

const JobCandidates = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [candidates] = useState([
    { 
      name: "John Doe",
      matchPercentage: 95,
      skills: ["React", "TypeScript", "Node.js"],
      experience: "4 years",
      status: "Shortlisted"
    },
    { 
      name: "Jane Smith",
      matchPercentage: 88,
      skills: ["React", "JavaScript", "MongoDB"],
      experience: "3 years",
      status: "In Review"
    },
    { 
      name: "Mike Johnson",
      matchPercentage: 85,
      skills: ["Angular", "Python", "AWS"],
      experience: "5 years",
      status: "Pending"
    },
    { 
      name: "Sarah Williams",
      matchPercentage: 82,
      skills: ["Vue.js", "Node.js", "PostgreSQL"],
      experience: "2 years",
      status: "Shortlisted"
    },
    { 
      name: "Tom Brown",
      matchPercentage: 80,
      skills: ["React Native", "Firebase", "TypeScript"],
      experience: "3.5 years",
      status: "In Review"
    }
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
      <div className="flex-1 p-6 ml-60">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-black">
            {job?.title || 'Loading...'} - Top Candidates
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        candidate.matchPercentage >= 85 ? 'bg-green-100 text-green-800' :
                        candidate.matchPercentage >= 75 ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {candidate.matchPercentage}% Match
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.experience}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        candidate.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                        candidate.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {candidate.status}
                      </span>
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

export default JobCandidates;