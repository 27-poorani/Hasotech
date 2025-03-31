import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LeftNavigation from '../components/LeftNavigation';

interface ResumeMatch {
  jobTitle: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

const ResumeScreen = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [availableJobs, setAvailableJobs] = useState<Array<{
    _id: string,
    title: string,
    description: string,
    skillSet: string[],
    experience: string,
    recruiterEmail: string
  }>>([]);
  const [isScreening, setIsScreening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resumeMatches, setResumeMatches] = useState<ResumeMatch[]>([]);

  // Get user data
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user?.token;

  // Create axios instance
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    if (!user?.token) {
      alert('Please login to screen resumes');
      navigate('/login');
      return;
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get(`/jobs/recruiter/${user._id}`);
      if (response.data.success) {
        setAvailableJobs(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/login');
      }
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedJob) {
      alert("Please select a job posting first");
      return;
    }

    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsScreening(true);
    setShowResults(false);

    try {
      // Process multiple files
      for (let i = 0; i < files.length; i++) {
        await simulateResumeScreening(files[i]);
      }
      setShowResults(true);
    } catch (error) {
      console.error("Resume screening failed:", error);
      alert("Resume screening failed. Please try again.");
    } finally {
      setIsScreening(false);
    }
  };

  const simulateResumeScreening = async (file: File) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedJobData = availableJobs.find(job => job._id === selectedJob);

    if (selectedJobData) {
      // Split the skills array in half for 50% match
      const halfIndex = Math.ceil(selectedJobData.skillSet.length / 2);
      const matchedSkills = selectedJobData.skillSet.slice(0, halfIndex);
      const missingSkills = selectedJobData.skillSet.slice(halfIndex);

      setResumeMatches([{
        jobTitle: selectedJobData.title,
        matchPercentage: 50, // Always set to 50%
        matchedSkills,
        missingSkills
      }]);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <LeftNavigation />
      
      {/* Main Content */}
      <div className="flex-1 p-6 ml-64 pt-20">
        <div className="p-8 rounded-lg" style={{ 
          backgroundColor: '#242424',
          border: '1px solid #ffd700',
          boxShadow: '0 0 10px rgba(177, 150, 14, 0.2)'
        }}>
          <div className="items-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: '#ffd700' }}>Resume Screening</h1>
          <button
            onClick={() => navigate("/recruiter-dashboard")}
            className="mt-4 px-4 py-2 rounded-lg hover:bg-gray-800"
            style={{
              backgroundColor: '#333',
              color: '#ffd700',
              border: '1px solid #ffd700'
            }}
          >
            Back to Dashboard
          </button>

          <div className="mt-6">
            <div className="p-6 rounded-lg" style={{ 
              backgroundColor: '#242424',
              border: '1px solid #ffd700',
              boxShadow: '0 0 10px rgba(177, 150, 14, 0.2)'
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Select Job Posting</label>
                  <select
                    className="w-full p-3 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    required
                  >
                    <option value="">Select a job posting</option>
                    {availableJobs.map(job => (
                      <option key={job._id} value={job._id}>{job.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Upload Resumes</label>
                  <div className="p-6 text-center rounded-lg" style={{
                    border: '2px dashed #ffd700',
                    backgroundColor: '#333'
                  }}>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                      disabled={!selectedJob}
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                      style={{ color: '#ffd700' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#ffd700">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span style={{ color: '#ffd700' }}>
                        {selectedJob ? 'Click to upload or drag and drop' : 'Please select a job posting first'}
                      </span>
                      <span style={{ color: '#999' }}>
                        Supported formats: PDF, DOC, DOCX
                      </span>
                    </label>
                  </div>
                </div>

                {isScreening && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 mx-auto" style={{ borderColor: '#ffd700', borderRightColor: 'transparent', borderWidth: '2px' }}></div>
                    <p style={{ color: '#ffd700' }} className="mt-2">Screening resumes...</p>
                  </div>
                )}

                {showResults && resumeMatches.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3" style={{ color: '#ffd700' }}>Matching Results:</h3>
                    {resumeMatches.map((match, index) => (
                      <div key={index} className="rounded-lg p-4 mb-3" style={{
                        backgroundColor: '#333',
                        border: '1px solid #ffd700'
                      }}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium" style={{ color: '#ffd700' }}>{match.jobTitle}</h4>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: match.matchPercentage >= 70 ? '#1a4731' : match.matchPercentage >= 40 ? '#433a17' : '#431717',
                            color: match.matchPercentage >= 70 ? '#4ade80' : match.matchPercentage >= 40 ? '#fcd34d' : '#f87171'
                          }}>
                            {match.matchPercentage}% Match
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p style={{ color: '#999' }}>Matched Skills:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {match.matchedSkills.map((skill, idx) => (
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
                          </div>
                          {match.missingSkills.length > 0 && (
                            <div>
                              <p style={{ color: '#999' }}>Missing Skills:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {match.missingSkills.map((skill, idx) => (
                                  <span key={idx} style={{
                                    backgroundColor: '#431717',
                                    color: '#f87171',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.875rem'
                                  }}>
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

    </div>
  );
};

export default ResumeScreen;