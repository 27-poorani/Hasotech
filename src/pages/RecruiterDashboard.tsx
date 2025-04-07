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
    <div className="flex min-h-screen bg-white"style={{ marginLeft: '-200px' }}>
    {/* Left Navigation */}
    <div className="w-64 min-h-screen bg-white p-4 border-r border-gray-200 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-4">
        <img src="/aimnbbnm.jpg" alt="AIRecruiterX" className="w-25 h-8" />
      </div>
      <div className="text-gray-600 text-xs mb-6">RECRUITMENT</div>

        <nav className="space-y-2">
          <div className="p-3 rounded-lg bg-black">
            <a href="/dashboard" className="flex items-center text-white">
              <span className="mr-3">⬚</span>
              Dashboard
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/viewjobs" className="flex items-center text-gray-400">
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
        {/* Header with Notifications */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-6">
            <button className="text-black hover:text-gray-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <button className="text-black hover:text-gray-600 relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button className="text-black hover:text-gray-600 relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </button>
          </div>
          <div className="rounded-lg hover:bg-[#242424] transition-colors px-4 py-2">
            <a href="/profile" className="flex items-center text-black hover:text-black">
              <span className="mr-2">👤</span>
              Profile
            </a>
          </div>
        </div>

        {/* Welcome Message Card */}
        <div className="bg-black text-white p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-2">Hello Recruiter!</h2>
          <p className="mb-4">You have 16 new applications. It's a lot of work for today! So let's start.</p>
          <button onClick={() => navigate("/jobs")}  className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100">
            Post Job
          </button>
        </div>
     
        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Left Section - Action Cards */}
          <div className="col-span-2 grid grid-cols-2 gap-6">
            {/* Create Job Card - Made larger */}
            <div className="p-8 rounded-lg col-span-2" style={{ 
              background: 'white',
              border: '1px solid rgba(255, 215, 0, 0.1)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
       

            {/* Recently Posted Jobs Table */}
            <div className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl" style={{ color: 'black' }}>Recently Posted Jobs</h4>
                <button onClick={() => navigate("/viewjobs")} className="px-4 py-2 rounded-lg text-lg" style={{ backgroundColor: 'black ', color: 'white' }}>
                  View All
                </button>
              </div>
              {availableJobs.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {availableJobs.slice(0, 3).map((job) => (
                    <div key={job._id} className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-all">
                      <div className="flex flex-col">
                        <h5 className="font-medium text-black text-lg mb-2">{job.title}</h5>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center text-gray-600">
                            <img src="/exp.png" alt="Experience" className="w-5 h-5 mr-2" />
                            <span className="text-sm">{job.experience}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {job.skillSet.slice(0, 3).map((skill, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skillSet.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{job.skillSet.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            Recruiter Mail: {job.recruiterEmail}
                          </div>
                          
                          {/* Added Candidates Section */}
                          <div className="mt-4 border-t pt-3">
                            <h6 className="text-sm font-medium text-black mb-2">Top Matches</h6>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">John Doe</span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  95% Match
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Jane Smith</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  88% Match
                                </span>
                              </div>
                              <button 
                                onClick={() => navigate(`/job-candidates/${job._id}`)}
                                className="w-full mt-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                View More
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-200">
                  <img src="/job-post.png" alt="Post Job" className="w-39 h-32 mb-6 animate-bounce" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">No Jobs Posted Yet</h3>
                  <p className="text-gray-500 mb-6">Start by creating your first job posting</p>
                  <button 
                    onClick={() => navigate('/jobs')}
                    className="group relative px-8 py-4 bg-black text-white rounded-lg text-lg font-medium
                      transform hover:scale-105 transition-all duration-300
                      shadow-lg hover:shadow-xl overflow-hidden"
                  >
                    <span className="relative z-10">✨ Create Your First Job</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Remove the Matched Candidates section and continue with Schedule Interviews Card */}
          {/* Schedule Interviews Card */}
          <div className="p-8 rounded-lg col-span-2" style={{ 
            background: 'white',
            border: '1px solid rgba(255, 215, 0, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
           

            {/* Recent Interviews Table */}
            <div className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl" style={{ color: 'black' }}>Scheduled Meetings</h4>
                <button className="px-4 py-2 rounded-lg bg-black text-white">
                  View Calendar
                </button>
              </div>

              {/* Interview Cards Container */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Technical Interview */}
                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                  <h5 className="font-medium text-black">Technical Interview - John Smith</h5>
                  <p className="text-gray-500 text-sm mt-1">Today at 2:00 PM</p>
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm mt-2">
                    Upcoming
                  </span>
                </div>

                {/* HR Interview */}
                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                  <h5 className="font-medium text-black">HR Interview - Mike Tyler</h5>
                  <p className="text-gray-500 text-sm mt-1">Tomorrow at 11:00 AM</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mt-2">
                    Scheduled
                  </span>
                </div>

                {/* Design Task Review */}
                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                  <h5 className="font-medium text-black">Design Task Review - Ella Clinton</h5>
                  <p className="text-gray-500 text-sm mt-1">Jan 23, 2025 at 3:30 PM</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mt-2">
                    Confirmed
                  </span>
                </div>
              </div>

              {/* AI Interview Section */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-black">AI Interview Scheduling</h5>
                    <p className="text-gray-500 text-sm">Automated video/audio interviews will be conducted and recorded</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-black text-white text-sm">
                    Configure AI Interview
                  </button>
                </div>
              </div>
              </div>
            </div>

          
                   
</div>
</div>
</div>
</div>  
                
                 

                
              
      

  );
};
export default RecruiterDashboard;