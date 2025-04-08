import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LeftNavigation from '../components/LeftNavigation';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

interface ResumeMatch {
  phoneNumber: string;
  ranking: string;
  jdMatchPercentage: string;
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
  const [error, setError] = useState<string | null>(null);

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
      alert("Please select a job posting first.");
      return;
    }

    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsScreening(true);
    setShowResults(false);
    setError(null);

    try {
      const jobDescription =
        availableJobs.find((job) => job._id === selectedJob)?.description ||
        "No job description available.";

      const prompt = `
        You are an expert resume analyzer. Your task is to analyze the provided resume against the job description and provide a detailed assessment.

        Job Description:
        ${jobDescription}

        Instructions for Resume Analysis:
        1. Read the resume text carefully
        2. Look for contact information, especially phone numbers
        3. Analyze the resume content against the job requirements
        4. Provide a detailed assessment of the match

        IMPORTANT: You must respond with ONLY a valid JSON object in this exact format:
        {
          "phoneNumber": "extracted phone number or N/A",
          "ranking": "Strong Match/Good Match/Average Match/Poor Match",
          "jdMatchPercentage": "XX%",
          "analysis": "Brief explanation of the assessment"
        }
      `;

      const results: ResumeMatch[] = [];
      
      for (const file of Array.from(files)) {
        try {
          const text = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => resolve(reader.result?.toString() || "");
          });

          const filePrompt = `${prompt}\n\nResume Content:\n${text}`;
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
          const result = await model.generateContent(filePrompt);
          const responseText = await result.response.text();
          
          try {
            const cleanedResponse = responseText.trim();
            const parsedResponse = JSON.parse(cleanedResponse);
            
            results.push({
              phoneNumber: parsedResponse.phoneNumber || "N/A",
              ranking: parsedResponse.ranking || "Unable to Analyze",
              jdMatchPercentage: parsedResponse.jdMatchPercentage || "0%"
            });
          } catch (parseError) {
            console.error("Error parsing response:", parseError);
            
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              try {
                const extractedJson = JSON.parse(jsonMatch[0]);
                results.push({
                  phoneNumber: extractedJson.phoneNumber || "N/A",
                  ranking: extractedJson.ranking || "Unable to Analyze",
                  jdMatchPercentage: extractedJson.jdMatchPercentage || "0%"
                });
              } catch (extractError) {
                results.push({
                  phoneNumber: "N/A",
                  ranking: "Error Processing",
                  jdMatchPercentage: "0%"
                });
              }
            }
          }
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          results.push({
            phoneNumber: "N/A",
            ranking: "Error Processing",
            jdMatchPercentage: "0%"
          });
        }
      }

      if (results.length > 0) {
        setResumeMatches(results);
        setShowResults(true);
      } else {
        setError("No results were generated. Please try again.");
      }
    } catch (error: any) {
      console.error("Resume screening failed:", error);
      setError("Error screening resumes. Please try again.");
    } finally {
      setIsScreening(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <LeftNavigation />
      <div className="flex-1 p-8 ml-64">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-semibold text-black">Resume Screening</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-12 mx-4">
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Job Selection */}
            <div>
              <h3 className="text-lg font-medium mb-3">Select Job Posting</h3>
              <select
                className="w-full p-3 rounded-full border border-gray-300 bg-white text-gray-900"
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
              <h3 className="text-lg font-medium mb-3">Upload Resumes</h3>
              <div className="p-28 text-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                <input
                  type="file"
                  multiple
                  accept=".txt"
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
                    Please upload text files (.txt) only
                  </span>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

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
                <h2 className="text-xl font-semibold mb-4">Screening Results</h2>
                {resumeMatches.map((match, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 mb-4 border border-gray-200"
                  >
                    <h4 className="font-semibold mb-3">Resume {index + 1}</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-600">Phone Number</p>
                        <p className="font-medium">{match.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Ranking</p>
                        <p className="font-medium">{match.ranking}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Match Percentage</p>
                        <p className="font-medium">{match.jdMatchPercentage}</p>
                      </div>
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