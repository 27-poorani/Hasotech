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
    <div className="flex min-h-screen bg-white">
      <LeftNavigation />
      <div className="flex-1 p-8 ml-64">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-semibold text-black">Resume Screening</h1>
         
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Job Selection */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Select Job Posting</label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900"
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

            {/* Resume Upload */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Upload Resumes</label>
              <div className="p-6 text-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
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
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-gray-600">
                    {selectedJob ? 'Click to upload or drag and drop' : 'Please select a job posting first'}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Supported formats: PDF, DOC, DOCX
                  </span>
                </label>
              </div>
            </div>

            {/* Loading State */}
            {isScreening && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-r-transparent mx-auto"></div>
                <p className="mt-2 text-gray-600">Screening resumes...</p>
              </div>
            )}

            {/* Results */}
            {showResults && resumeMatches.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4 text-black">Matching Results</h3>
                {resumeMatches.map((match, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">{match.jobTitle}</h4>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        match.matchPercentage >= 70 
                          ? 'bg-green-100 text-green-800' 
                          : match.matchPercentage >= 40 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {match.matchPercentage}% Match
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-600 mb-2">Matched Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {match.matchedSkills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      {match.missingSkills.length > 0 && (
                        <div>
                          <p className="text-gray-600 mb-2">Missing Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {match.missingSkills.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
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
  );
};

export default ResumeScreen;