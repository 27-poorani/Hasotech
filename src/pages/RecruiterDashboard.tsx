import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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
  const [availableJobs, setAvailableJobs] = useState<Array<{
    _id: string,
    title: string,
    description: string,
    skillSet: string[],
    experience: string,
    recruiterEmail: string
  }>>([]);

  const [screenedCandidates, setScreenedCandidates] = useState<CandidateMatch[]>([]);
  const [isScreeningCandidates, setIsScreeningCandidates] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);

  const [recentJobs, setRecentJobs] = useState<Array<{
    _id: string,
    title: string,
  }>>([]);


  const handleDelete = async (jobId: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;
  
    if (!token) {
      alert("Authentication required!");
      return;
    }
  
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:8000/jobs/delete/${jobId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data.success) {
        alert("Job deleted successfully!");
        fetchPostedJobs(); // Refresh both job lists
      } else {
        throw new Error(response.data.message || 'Failed to delete job');
      }
    } catch (error: any) {
      console.error("Error deleting job:", error);
      alert(error.response?.data?.message || "Error deleting job. Try again later.");
    }
  };
  
  // Modify the fetchPostedJobs function
  const fetchPostedJobs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Modified to fetch only jobs for the current recruiter
      const response = await axios.get(`http://localhost:8000/jobs/recruiter/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setAvailableJobs(response.data.data);
        // Get the most recent 3 jobs
        const recent = response.data.data
          .slice(0, 3)
          .map((job: any) => ({
            _id: job._id,
            title: job.title
          }));
        setRecentJobs(recent);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchScheduledInterviews = () => {
    const storedInterviews = JSON.parse(localStorage.getItem('scheduledInterviews') || '[]');
    // Sort interviews by date and time
    const sortedInterviews = storedInterviews.sort((a: any, b: any) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
    setScheduledInterviews(sortedInterviews);
  };

  useEffect(() => {
    fetchPostedJobs();
    fetchScheduledInterviews();
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
    const matches = availableJobs.map(job => {
      const matchedSkills = job.skillSet.filter((skill: string) =>
        extractedSkills.includes(skill)
      );
      const missingSkills = job.skillSet.filter((skill: string) =>
        !extractedSkills.includes(skill)
      );
      const matchPercentage = (matchedSkills.length / job.skillSet.length) * 100;

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
    if (!interviewData.candidateName || !interviewData.position || 
        !interviewData.date || !interviewData.time || !interviewData.interviewerName) {
      alert('Please fill in all required fields');
      return;
    }

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
    <div className="flex min-h-screen bg-black">
    
      {/* Left Navigation */}
      <div className="w-64 min-h-screen bg-black p-4 border-r border-gray-800 fixed left-0 top-0">
        <div className="flex items-center gap-2 mb-4">
          <img src="/ai.jpg" alt="ATS" className="w-25 h-8" />
        </div>
        <div className="text-gray-500 text-xs mb-6">RECRUITMENT</div>

        <nav className="space-y-2">
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-orange-500">
            <a href="/dashboard" className="flex items-center text-white">
              <span className="mr-3">⬚</span>
              Dashboard
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/jobs" className="flex items-center text-gray-400">
              <span className="mr-3">📋</span>
              Jobs
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/ai-screening" className="flex items-center text-gray-400">
              <span className="mr-3">👥</span>
              Candidates
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/resumescreen" className="flex items-center text-gray-400">
              <span className="mr-3">🔍</span>
              Screening
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/schedule-interview" className="flex items-center text-gray-400">
              <span className="mr-3">💬</span>
              Interviews
            </a>
          </div>
          
        </nav>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 p-6 ml-64 min-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">
            Hello Recruiter! welcome back...!!
          </h1>
          <div className="rounded-lg hover:bg-[#242424] transition-colors px-4 py-2">
            <a href="/profile" className="flex items-center text-white hover:text-white">
              <span className="mr-2">👤</span>
              Profile
            </a>
          </div>
        </div>

        {/* Rest of your existing dashboard content */}
        {/* You need to Hire Section */}
        <div className="mt-4 p-4 rounded-lg bg-black">
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#ffd700' }}>You Need to Hire</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex gap-4">
              {/* Content Designer */}
              <div className="w-full p-4 rounded-lg" style={{ background: 'linear-gradient(145deg, #242424 0%, #1a1a1a 100%)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-white">3</span>
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="#330000"
                        strokeWidth="4"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="#ff0000"
                        strokeWidth="4"
                        strokeDasharray={`${75 * 1.26} 126`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-red-500">75%</span>
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium" style={{ color: '#ffd700' }}>Content Designers</p>
              </div>

              {/* Node js developer */}
              <div className="w-full p-4 rounded-lg" style={{ background: 'linear-gradient(145deg, #242424 0%, #1a1a1a 100%)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-white">9</span>
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="#330000"
                        strokeWidth="4"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="#ff0000"
                        strokeWidth="4"
                        strokeDasharray={`${5 * 1.26} 126`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-red-500">5%</span>
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium" style={{ color: '#ffd700' }}>Node js developer</p>
              </div>
            </div>

            <div className="flex gap-4">
              {/* Senior UI Designer */}
              <div className="w-full p-4 rounded-lg" style={{ background: 'linear-gradient(145deg, #242424 0%, #1a1a1a 100%)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-white">2</span>
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="#330000"
                        strokeWidth="4"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="#ff0000"
                        strokeWidth="4"
                        strokeDasharray={`${50 * 1.26} 126`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-red-500">50%</span>
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium" style={{ color: '#ffd700' }}>Senior UI Designer</p>
              </div>

              {/* Marketing managers */}
              <div className="w-full p-4 rounded-lg" style={{ background: 'linear-gradient(145deg, #242424 0%, #1a1a1a 100%)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-white">4</span>
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="#330000"
                        strokeWidth="4"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="#ff0000"
                        strokeWidth="4"
                        strokeDasharray={`${45 * 1.26} 126`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-red-500">45%</span>
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium" style={{ color: '#ffd700' }}>Marketing managers</p>
              </div>
            </div>
          </div>
        </div>
<br></br>
      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Left Section - Action Cards */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          {/* Create Job Card - Made larger */}
          <div className="p-8 rounded-lg col-span-2" style={{ 
            background: 'linear-gradient(145deg, #1a1a1a 0%, #242424 100%)',
            border: '1px solid rgba(255, 215, 0, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl mb-4" style={{ color: '#ffd700' }}>Create a job post</h3>
                <div className="flex gap-4">
                  <button onClick={() => navigate("/jobs")} className="px-6 py-3 rounded-lg text-lg" style={{ backgroundColor: '#ff6b00', color: 'white' }}>
                    Post Job
                  </button>
                  <button onClick={() => navigate("/viewjobs")} className="px-6 py-3 rounded-lg text-lg" style={{ backgroundColor: '#ff6b00', color: 'white' }}>
                    View Jobs
                  </button>
                </div>
              </div>
            </div>

            {/* Recently Posted Jobs Table */}
            <div className="mt-8">
              <h4 className="text-xl mb-4" style={{ color: '#ffd700' }}>Recently Posted Jobs</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2" style={{ color: '#ffd700', borderBottom: '1px solid #ffd700' }}>Title</th>
                      <th className="text-left p-2" style={{ color: '#ffd700', borderBottom: '1px solid #ffd700' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableJobs.slice(0, 3).map((job) => (
                      <tr key={job._id} className="hover:bg-gray-800">
                        <td className="p-2" style={{ color: '#fff', borderBottom: '1px solid rgba(255, 215, 0, 0.1)' }}>{job.title}</td>
                        <td className="p-2" style={{ color: '#fff', borderBottom: '1px solid rgba(255, 215, 0, 0.1)' }}>
                          <div className="flex gap-5">
                            <button
                              onClick={() => {
                                const jobDetails = availableJobs.find(j => j._id === job._id);
                                if (jobDetails) {
                                  navigate(`/job-view/${job._id}`, { state: { jobDetails } });
                                }
                              }}
                              className="px-3 py-1 rounded-lg hover:bg-gray-700"
                              style={{ backgroundColor: '#333', color: '#ffd700', border: '1px solid #ffd700' }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => navigate(`/jobs/edit/${job._id}`)}
                              className="px-3 py-1 rounded-lg hover:bg-gray-700"
                              style={{ backgroundColor: '#333', color: '#ffd700', border: '1px solid #ffd700' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(job._id)}
                              className="px-3 py-1 rounded-lg hover:bg-gray-700"
                              style={{ backgroundColor: '#333', color: '#ff4444', border: '1px solid #ff4444' }}
                            >
                              Delete
                            </button>
                            <button
                              // onClick={() => navigate(`/jobs/edit/${job._id}`)}
                              className="px-3 py-1 rounded-lg hover:bg-gray-700"
                              style={{ backgroundColor: '#333', color: '#ffd700', border: '1px solid #ffd700' }}
                            >
                              Publish Job to Naukri
                            </button>
                             
                            
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Resume Screening Card */}
          <div className="p-6 rounded-lg" style={{ 
            background: 'linear-gradient(145deg, #1a1a1a 0%, #242424 100%)',
            border: '1px solid rgba(255, 215, 0, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 className="text-xl mb-4" style={{ color: '#ffd700' }}>Resume Screening</h3>
            <button onClick={() => navigate("/resumescreen")} className="px-4 py-2 rounded-lg" style={{ backgroundColor: '#ff6b00', color: 'white' }}>
              Start Screening
            </button>
          </div>

          {/* Candidate Shortlisting Card */}
          <div className="p-6 rounded-lg" style={{ 
            background: 'linear-gradient(145deg, #1a1a1a 0%, #242424 100%)',
            border: '1px solid rgba(255, 215, 0, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 className="text-xl mb-4" style={{ color: '#ffd700' }}>Candidate Shortlisting</h3>
            <button onClick={() => navigate("/ai-screening")} className="px-4 py-2 rounded-lg" style={{ backgroundColor: '#ff6b00', color: 'white' }}>
              View Shortlisted Candidates
            </button>
          </div>

          {/* Schedule Interviews Card */}
          <div className="p-8 rounded-lg col-span-2" style={{ 
            background: 'linear-gradient(145deg, #1a1a1a 0%, #242424 100%)',
            border: '1px solid rgba(255, 215, 0, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
           

            {/* Recent Interviews Table */}
            <div className="mt-8">
              <h4 className="text-xl mb-4" style={{ color: '#ffd700' }}>Recent Interviews</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2" style={{ color: '#ffd700', borderBottom: '1px solid #ffd700' }}>Job Title</th>
                      <th className="text-left p-2" style={{ color: '#ffd700', borderBottom: '1px solid #ffd700' }}>Candidate</th>
                      <th className="text-left p-2" style={{ color: '#ffd700', borderBottom: '1px solid #ffd700' }}>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduledInterviews.length > 0 ? (
                      scheduledInterviews.slice(0, 3).map((interview) => (
                        <tr key={interview.id} className="hover:bg-gray-800">
                          <td className="p-2" style={{ color: '#fff', borderBottom: '1px solid rgba(255, 215, 0, 0.1)' }}>
                            {interview.position}
                          </td>
                          <td className="p-2" style={{ color: '#fff', borderBottom: '1px solid rgba(255, 215, 0, 0.1)' }}>
                            {interview.candidateName}
                          </td>
                          <td className="p-2" style={{ color: '#fff', borderBottom: '1px solid rgba(255, 215, 0, 0.1)' }}>
                            {`${interview.date} ${interview.time}`}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-2 text-center" style={{ color: '#fff' }}>
                          No interviews scheduled
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Calendar remains the same */}
        <div className="p-6 rounded-lg" style={{ 
          background: 'linear-gradient(145deg, #1a1a1a 0%, #242424 100%)',
          border: '1px solid rgba(255, 215, 0, 0.1)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 className="text-xl mb-4" style={{ color: '#ffd700' }}>March 2025</h3>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-gray-400 text-sm">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
              <div
                key={day}
                className="p-2 rounded hover:bg-gray-700 cursor-pointer"
                style={{ color: '#fff' }}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>


  
                
                 

                
              
            </div>
          </div>
      

  );
};
export default RecruiterDashboard;