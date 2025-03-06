import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Job {
  id: number;
  title: string;
  candidates: number;
  requiredSkills: string[];
}

interface ResumeMatch {
  jobTitle: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

interface InterviewSlot {
  id: number;
  date: string;
  time: string;
  candidateName: string;
  position: string;
  interviewerName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

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

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([
    { 
      id: 1, 
      title: "Software Engineer", 
      candidates: 12,
      requiredSkills: ["JavaScript", "React", "Node.js", "TypeScript", "MongoDB"]
    },
    { 
      id: 2, 
      title: "UI/UX Designer", 
      candidates: 8,
      requiredSkills: ["Figma", "Adobe XD", "UI Design", "User Research", "Prototyping"]
    },
  ]);

  const [resumeMatches, setResumeMatches] = useState<ResumeMatch[]>([]);
  const [isScreening, setIsScreening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFetchedResumes, setShowFetchedResumes] = useState(false);

  const [fetchedResumes, setFetchedResumes] = useState<Array<{
    id: number;
    name: string;
    date: string;
    fileUrl: string;
  }>>([]);

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [interviewData, setInterviewData] = useState({
    candidateName: '',
    position: '',
    date: '',
    time: '',
    interviewerName: '',
    notes: ''
  });
  const [scheduledInterviews, setScheduledInterviews] = useState<InterviewSlot[]>([]);

  const [selectedJob, setSelectedJob] = useState<string>("");
  const [availableJobs, setAvailableJobs] = useState<Array<{id: number, title: string}>>([]);

  const [screenedCandidates, setScreenedCandidates] = useState<CandidateMatch[]>([]);
  const [isScreeningCandidates, setIsScreeningCandidates] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    setAvailableJobs([
      { id: 1, title: "Software Engineer" },
      { id: 2, title: "UI/UX Designer" },
      { id: 3, title: "Product Manager" }
    ]);
  }, []);

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

    // Simulate extracted skills (in real app, this would come from backend)
    const extractedSkills = ["JavaScript", "React", "TypeScript", "HTML", "CSS"];

    // Match against each job
    const matches = jobs.map(job => {
      const matchedSkills = job.requiredSkills.filter(skill => 
        extractedSkills.includes(skill)
      );
      const missingSkills = job.requiredSkills.filter(skill => 
        !extractedSkills.includes(skill)
      );
      const matchPercentage = (matchedSkills.length / job.requiredSkills.length) * 100;

      return {
        jobTitle: job.title,
        matchPercentage: Math.round(matchPercentage),
        matchedSkills,
        missingSkills
      };
    });

    setResumeMatches(matches);
    setShowResults(true);
  };

  const handleFetchResumes = () => {
    // Simulated fetched resumes (in real app, this would come from an API)
    const mockResumes = [
      { id: 1, name: "John_Doe_Resume.pdf", date: "2024-03-15", fileUrl: "#" },
      { id: 2, name: "Jane_Smith_Resume.docx", date: "2024-03-14", fileUrl: "#" },
      { id: 3, name: "Mike_Johnson_Resume.pdf", date: "2024-03-13", fileUrl: "#" },
    ];
    
    setFetchedResumes(mockResumes);
    setShowFetchedResumes(true);
  };

  const handleScheduleInterview = () => {
    const newInterview: InterviewSlot = {
      id: scheduledInterviews.length + 1,
      date: interviewData.date,
      time: interviewData.time,
      candidateName: interviewData.candidateName,
      position: interviewData.position,
      interviewerName: interviewData.interviewerName,
      status: 'scheduled'
    };

    setScheduledInterviews([...scheduledInterviews, newInterview]);
    
    // Reset form and close modal
    setInterviewData({
      candidateName: '',
      position: '',
      date: '',
      time: '',
      interviewerName: '',
      notes: ''
    });
    setShowScheduleForm(false);

    // Show success message (you can implement this)
    alert('Interview scheduled successfully!');
  };

  const screenCandidatesWithAI = async () => {
    setIsScreeningCandidates(true);
    try {
      // Simulate API call for AI screening
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated results
      const results: CandidateMatch[] = [
        {
          id: 1,
          name: "John Doe",
          matchPercentage: 95,
          skills: ["React", "TypeScript", "Node.js"],
          experience: "4 years",
          availability: { status: 'pending' }
        },
        {
          id: 2,
          name: "Jane Smith",
          matchPercentage: 88,
          skills: ["React", "JavaScript", "MongoDB"],
          experience: "3 years",
          availability: { status: 'pending' }
        },
        // Add more candidates...
      ];
      
      setScreenedCandidates(results);
    } catch (error) {
      console.error("AI screening failed:", error);
      alert("Screening failed. Please try again.");
    } finally {
      setIsScreeningCandidates(false);
    }
  };

  const initiateAutoCalls = async (candidateIds: number[]) => {
    // Simulate automated calls
    const updatedCandidates = screenedCandidates.map(candidate => {
      if (candidateIds.includes(candidate.id)) {
        return {
          ...candidate,
          availability: {
            status: 'available',
            preferredSlots: [
              '2024-03-20 10:00 AM',
              '2024-03-21 02:00 PM',
              '2024-03-22 11:00 AM'
            ]
          }
        };
      }
      return candidate;
    });
    
    setScreenedCandidates(updatedCandidates);
  };

  return (
    <div className="min-h-screen p-6 pt-28">
      <div className="min-h-screen p-6"><br/>
        {/* Dashboard Header */}
        <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800">Recruiter Dashboard</h1>
          <a href="/profile" className="text-2xl font-bold forgot-link text-black">Profile</a>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Job Listings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Job Listings</h2>
            {jobs.map((job) => (
              <div key={job.id} className="p-3 bg-gray-50 rounded-md mb-3">
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.candidates} Candidates Applied</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Required Skills:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {job.requiredSkills.map((skill, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => navigate("/jobs")} className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Manage Jobs
            </button>
          </div>

          {/* Resume Upload and Screening */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Resume Screening</h2>
            <div className="space-y-4">
              {/* Job Selection Dropdown */}
              <div>
                <label className="block text-gray-700 mb-2">Select Job Posting</label>
                <select
                  className="w-full p-3 border rounded-lg bg-gray-50"
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  required
                >
                  <option value="">Select a job posting</option>
                  {availableJobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bulk Resume Upload */}
              <div>
                <label className="block text-gray-700 mb-2">Upload Resumes</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
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

              {/* Screening Status */}
              {isScreening && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Screening resumes...</p>
                </div>
              )}

              {/* Results Section */}
              {showResults && resumeMatches.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Matching Results:</h3>
                  {resumeMatches.map((match, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{match.jobTitle}</h4>
                        <span className={`px-2 py-1 rounded ${
                          match.matchPercentage >= 70 ? 'bg-green-100 text-green-700' :
                          match.matchPercentage >= 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {match.matchPercentage}% Match
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600">Matched Skills:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {match.matchedSkills.map((skill, idx) => (
                              <span key={idx} className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        {match.missingSkills.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600">Missing Skills:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {match.missingSkills.map((skill, idx) => (
                                <span key={idx} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
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

          {/* AI-Based Shortlisting */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">AI Candidate Shortlisting</h2>
            <p className="text-gray-600 text-sm mb-4">Screen and schedule interviews with the best matching candidates.</p>
            
            <button 
              onClick={screenCandidatesWithAI}
              className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 mb-4"
              disabled={isScreeningCandidates}
            >
              {isScreeningCandidates ? 'Screening Candidates...' : 'Start AI Screening'}
            </button>

            {screenedCandidates.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Matched Candidates</h3>
                  <button
                    onClick={() => initiateAutoCalls(selectedCandidates)}
                    disabled={selectedCandidates.length === 0}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    Call Selected Candidates
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCandidates(screenedCandidates.map(c => c.id));
                              } else {
                                setSelectedCandidates([]);
                              }
                            }}
                          />
                        </th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Match</th>
                        <th className="border p-2">Skills</th>
                        <th className="border p-2">Experience</th>
                        <th className="border p-2">Availability</th>
                        <th className="border p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {screenedCandidates.map((candidate) => (
                        <tr key={candidate.id} className="hover:bg-gray-50">
                          <td className="border p-2">
                            <input
                              type="checkbox"
                              checked={selectedCandidates.includes(candidate.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCandidates([...selectedCandidates, candidate.id]);
                                } else {
                                  setSelectedCandidates(selectedCandidates.filter(id => id !== candidate.id));
                                }
                              }}
                            />
                          </td>
                          <td className="border p-2">{candidate.name}</td>
                          <td className="border p-2">
                            <span className={`px-2 py-1 rounded text-sm ${
                              candidate.matchPercentage >= 90 ? 'bg-green-100 text-green-700' :
                              candidate.matchPercentage >= 70 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {candidate.matchPercentage}%
                            </span>
                          </td>
                          <td className="border p-2">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.map((skill, idx) => (
                                <span key={idx} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="border p-2">{candidate.experience}</td>
                          <td className="border p-2">
                            {candidate.availability?.status === 'available' ? (
                              <div className="text-green-600">
                                Available
                                <div className="text-xs text-gray-500">
                                  {candidate.availability.preferredSlots?.join(', ')}
                                </div>
                              </div>
                            ) : candidate.availability?.status === 'not_available' ? (
                              <span className="text-red-600">Not Available</span>
                            ) : (
                              <span className="text-yellow-600">Pending</span>
                            )}
                          </td>
                          <td className="border p-2">
                            {candidate.availability?.status === 'available' && (
                              <button
                                onClick={() => {
                                  setShowScheduleForm(true);
                                  setInterviewData({
                                    ...interviewData,
                                    candidateName: candidate.name,
                                    position: selectedJob || ''
                                  });
                                }}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              >
                                Schedule
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Schedule Interviews */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Schedule Interviews</h2>
            <p className="text-gray-600 text-sm">Set up interview slots and notify candidates.</p>
            <button 
              onClick={() => setShowScheduleForm(true)}
              className="w-full mt-3 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
            >
              Schedule Interview
            </button>
          </div>
        </div>

        {/* Add this Schedule Interview Form Modal */}
        {showScheduleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Schedule Interview</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Candidate Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={interviewData.candidateName}
                    onChange={(e) => setInterviewData({
                      ...interviewData,
                      candidateName: e.target.value
                    })}
                    placeholder="Enter candidate name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={interviewData.position}
                    onChange={(e) => setInterviewData({
                      ...interviewData,
                      position: e.target.value
                    })}
                    placeholder="Enter position"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-lg"
                    value={interviewData.date}
                    onChange={(e) => setInterviewData({
                      ...interviewData,
                      date: e.target.value
                    })}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-lg"
                    value={interviewData.time}
                    onChange={(e) => setInterviewData({
                      ...interviewData,
                      time: e.target.value
                    })}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Interviewer Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={interviewData.interviewerName}
                    onChange={(e) => setInterviewData({
                      ...interviewData,
                      interviewerName: e.target.value
                    })}
                    placeholder="Enter interviewer name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    value={interviewData.notes}
                    onChange={(e) => setInterviewData({
                      ...interviewData,
                      notes: e.target.value
                    })}
                    placeholder="Enter interview notes"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleScheduleInterview}
                  className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
                  disabled={!interviewData.candidateName || !interviewData.position || !interviewData.date || !interviewData.time || !interviewData.interviewerName}
                >
                  Schedule Interview
                </button>
                <button
                  onClick={() => {
                    setShowScheduleForm(false);
                    setInterviewData({
                      candidateName: '',
                      position: '',
                      date: '',
                      time: '',
                      interviewerName: '',
                      notes: ''
                    });
                  }}
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
