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
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-white">
      <LeftNavigation currentPage="interviews" />
      
      <div className="flex-1 p-6 ml-64">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-semibold text-black">Schedule Interview</h1>
        
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Candidate Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900"
                value={interviewData.candidateName}
                onChange={(e) => setInterviewData({
                  ...interviewData,
                  candidateName: e.target.value
                })}
                placeholder="Enter candidate name"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Position</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900"
                value={interviewData.position}
                onChange={(e) => setInterviewData({
                  ...interviewData,
                  position: e.target.value
                })}
                placeholder="Enter position"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Date</label>
              <input
                type="date"
                className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900"
                value={interviewData.date}
                onChange={(e) => setInterviewData({
                  ...interviewData,
                  date: e.target.value
                })}
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Time</label>
              <input
                type="time"
                className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900"
                value={interviewData.time}
                onChange={(e) => setInterviewData({
                  ...interviewData,
                  time: e.target.value
                })}
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Interviewer Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900"
                value={interviewData.interviewerName}
                onChange={(e) => setInterviewData({
                  ...interviewData,
                  interviewerName: e.target.value
                })}
                placeholder="Enter interviewer name"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Notes</label>
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900 min-h-[100px]"
                value={interviewData.notes}
                onChange={(e) => setInterviewData({
                  ...interviewData,
                  notes: e.target.value
                })}
                placeholder="Add any additional notes"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleScheduleInterview}
                className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
              >
                Schedule Interview
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;