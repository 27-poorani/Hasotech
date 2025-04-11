import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';



const RecruiterDashboard = () => {
  const navigate = useNavigate();

  

  const [availableJobs, setAvailableJobs] = useState<Array<{
    _id: string,
    title: string,
    description: string,
    skillSet: string[],
    experience: string,
    recruiterEmail: string
  }>>([]);

  // Modify fetchPostedJobs to remove recentJobs setting
  const fetchPostedJobs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await axios.get(`http://localhost:8000/jobs/recruiter/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setAvailableJobs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchPostedJobs();
  }, []);



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