import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import LeftNavigation from '../components/LeftNavigation';
import axios from 'axios';

const ScheduleInterview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { candidateId } = useParams();
  const [interviewData, setInterviewData] = useState({
    candidateName: location.state?.candidateName || '',
    position: '',
    date: '',
    time: '',
    interviewerName: '',
    notes: ''
  });

  const handleScheduleInterview = () => {
    if (!interviewData.candidateName || !interviewData.position || 
        !interviewData.date || !interviewData.time || !interviewData.interviewerName) {
      alert('Please fill in all required fields');
      return;
    }
  
    // Store interview data in localStorage
    const existingInterviews = JSON.parse(localStorage.getItem('scheduledInterviews') || '[]');
    const newInterview = {
      id: existingInterviews.length + 1,
      ...interviewData,
      status: 'scheduled'
    };
    
    localStorage.setItem('scheduledInterviews', JSON.stringify([...existingInterviews, newInterview]));
    alert('Interview scheduled successfully!');
    navigate('/recruiter-dashboard');
  };

  return (
    <div className="flex min-h-screen bg-black">
      <LeftNavigation currentPage="interviews" />
      
      <div className="flex-1 p-6 ml-64 pt-20">
        <div className="max-w-2xl mx-auto p-8 rounded-lg" style={{ 
          backgroundColor: '#242424',
          border: '1px solid #ffd700',
          boxShadow: '0 0 10px rgba(177, 150, 14, 0.2)'
        }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#ffd700' }}>Schedule Interview</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2" style={{ color: '#ffd700' }}>Candidate Name</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg"
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #ffd700'
                }}
                value={interviewData.candidateName}
                onChange={(e) => setInterviewData({
                  ...interviewData,
                  candidateName: e.target.value
                })}
                placeholder="Enter candidate name"
              />
            </div>

            <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Position</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                    value={interviewData.position}
                    onChange={(e) => setInterviewData({
                      ...interviewData,
                      position: e.target.value
                    })}
                    placeholder="Enter position"
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Date</label>
                  <input
                    type="date"
                    className="w-full p-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                    value={interviewData.date}
                    onChange={(e) => setInterviewData({
                      ...interviewData,
                      date: e.target.value
                    })}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Time</label>
                  <input
                    type="time"
                    className="w-full p-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                    value={interviewData.time}
                    onChange={(e) => setInterviewData({
                      ...interviewData,
                      time: e.target.value
                    })}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Interviewer Name</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                    value={interviewData.interviewerName}
                    onChange={(e) => setInterviewData({
                      ...interviewData,
                      interviewerName: e.target.value
                    })}
                    placeholder="Enter interviewer name"
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Notes</label>
                  <textarea
                    className="w-full p-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                    value={interviewData.notes}
                    onChange={(e) => setInterviewData({
                      ...interviewData,
                      notes: e.target.value
                    })}
                    placeholder="Add any additional notes"
                  />
                </div>
              </div>


            <div className="flex gap-4 mt-6">
              <button
                onClick={handleScheduleInterview}
                className="px-6 py-2 rounded-lg hover:bg-gray-800"
                style={{
                  backgroundColor: '#333',
                  color: '#ffd700',
                  border: '1px solid #ffd700'
                }}
              >
                Schedule Interview
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 rounded-lg hover:bg-gray-800"
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
        </div>
      </div>
  );
};

export default ScheduleInterview;