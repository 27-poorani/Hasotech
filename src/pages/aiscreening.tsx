import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftNavigation from '../components/LeftNavigation';

interface CandidateMatch {
  id: number;
  name: string;
  matchPercentage: number;
  skills: string[];
  experience: string;
  availability?: {
    status: 'pending' | 'available' | 'not_available';
    preferredSlots?: string[];
  };
}

const AIScreening = () => {
  const navigate = useNavigate();
  const [screenedCandidates] = useState<CandidateMatch[]>([
    {
      id: 1,
      name: "John Doe",
      matchPercentage: 95,
      skills: ["React", "TypeScript", "Node.js"],
      experience: "4 years",
      availability: { status: 'available' }
    },
    {
      id: 2,
      name: "Jane Smith",
      matchPercentage: 88,
      skills: ["React", "JavaScript", "MongoDB"],
      experience: "3 years",
      availability: { status: 'available' }
    }
  ]);

  // Remove selectedCandidates state, showScheduleForm, interviewData, and related functions

  return (
    <div className="flex min-h-screen bg-black">
      <LeftNavigation />
      <div className="flex-1 p-6 ml-64 pt-20">
        <div className="p-6 rounded-lg" style={{ 
          backgroundColor: '#242424',
          border: '1px solid #ffd700',
          boxShadow: '0 0 10px rgba(177, 150, 14, 0.2)'
        }}>
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: '#ffd700' }}>AI Candidate Shortlisting</h1>
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

    

          <div className="mt-6">
            <h3 className="font-semibold mb-4" style={{ color: '#ffd700' }}>Matched Candidates</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ borderColor: '#ffd700' }}>
                <thead>
                  <tr style={{ backgroundColor: '#333' }}>
                    <th className="p-2" style={{ borderColor: '#ffd700', color: '#ffd700' }}>Name</th>
                    <th className="p-2" style={{ borderColor: '#ffd700', color: '#ffd700' }}>Match</th>
                    <th className="p-2" style={{ borderColor: '#ffd700', color: '#ffd700' }}>Skills</th>
                    <th className="p-2" style={{ borderColor: '#ffd700', color: '#ffd700' }}>Experience</th>
                    <th className="p-2" style={{ borderColor: '#ffd700', color: '#ffd700' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {screenedCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-800">
                      <td className="p-2" style={{ borderColor: '#ffd700', color: '#fff' }}>{candidate.name}</td>
                      <td className="p-2" style={{ borderColor: '#ffd700' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: candidate.matchPercentage >= 90 ? '#1a4731' : 
                                         candidate.matchPercentage >= 70 ? '#433a17' : '#431717',
                          color: candidate.matchPercentage >= 90 ? '#4ade80' : 
                                candidate.matchPercentage >= 70 ? '#fcd34d' : '#f87171'
                        }}>
                          {candidate.matchPercentage}%
                        </span>
                      </td>
                      <td className="p-2" style={{ borderColor: '#ffd700' }}>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill, idx) => (
                            <span key={idx} style={{
                              backgroundColor: '#1a4731',
                              color: '#4ade80',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.875rem'
                            }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-2" style={{ borderColor: '#ffd700', color: '#fff' }}>{candidate.experience}</td>
                      <td className="p-2" style={{ borderColor: '#ffd700', color: '#4ade80' }}>Available</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIScreening;