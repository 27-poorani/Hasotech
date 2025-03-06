import { Link } from "react-router-dom";

function LearnMore() {
  return (
    <div className="w-full bg-white min-h-screen flex flex-col pt-80"> <br/><br/><br/><br/><br/><br/><br/><br/><br/> <br/><br/><br/><br/>{/* Increased pt-32 to push content further down */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">AI-Powered Applicant Tracking System (ATS)</h1>
      <p className="text-gray-700 text-lg leading-relaxed">
        Our AI-powered Applicant Tracking System (ATS) simplifies and streamlines the hiring process. It automates resume screening, ranks candidates based on job descriptions, and provides seamless communication and interview scheduling tools. With role-based access, recruiters can post jobs, manage resumes, and schedule interviews, while interviewers provide feedback and assess candidates. Super admins oversee system analytics and user management.
        <br /><br />
        Key features include AI-powered candidate matching, automated resume parsing, email notifications, interview scheduling, and offer letter management. The platform integrates with Google Meet and Zoom for virtual interviews, and supports bulk emailing for efficient candidate communication.
        <br /><br />
        Built with React.js and Node.js, our ATS leverages MongoDB for efficient data storage, OpenAI APIs for AI processing, and AWS or DigitalOcean for hosting. Future enhancements include LinkedIn and job portal integrations, AI-driven candidate scoring, and a mobile app for recruiters. This ATS is designed to help companies optimize hiring and find the best talent quickly and effectively.
      </p><br/><br/>
      <center> <Link
            to=""
            className="bg-blue-600 text-white text-center px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition-all "
          >
            Subcribe
          </Link>
          </center>
      <div className="mt-8 text-center">
        <Link to="/" className="text-blue-600 hover:underline text-lg">
          Go Back to Home
        </Link>
      </div>
      <div className="flex justify-center mt-10 px-6">
        <div className="relative bg-black rounded-lg p-4 w-full max-w-4xl">
          {/* AI Hiring Image */}
          <img 
            src="join.jpg" 
            alt="AI ATS Preview" 
            className="w-full h-auto rounded-lg"
          />
          
          {/* Overlay Text */}
          <div className="absolute top-6 right-9 text-white text-2xl font-semibold">
Join us to Recruit effortlessly       </div>

          {/* Join Beta Button */}
          <button className="absolute top-32 right-5 bg-white text-black px-4 py-2 rounded-full shadow-md hover:bg-gray-200 transition-all">
            Subscribe 
          </button>
        </div>
      </div>
      
      
    {/* Footer */}

    <footer className="bg-gray-900 text-gray-300 py-10 px-8 mt-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="text-white font-bold text-lg">AI-Powered ATS</h3>
            <p className="mt-2 text-gray-400">Start scaling your recruiting strategy today!</p>
          </div>
          <div>
            <h4 className="text-white font-semibold">Product</h4>
            <ul className="mt-2 space-y-2">
              <li><Link to="#" className="hover:text-white">Schedule</Link></li>
              <li><Link to="#" className="hover:text-white">Screen</Link></li>
              <li><Link to="#" className="hover:text-white">Attract</Link></li>
              <li><Link to="#" className="hover:text-white">Source</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold">Company</h4>
            <ul className="mt-2 space-y-2">
              <li><Link to="#" className="hover:text-white">About</Link></li>
              <li><Link to="#" className="hover:text-white">Partners</Link></li>
              <li><Link to="#" className="hover:text-white">Book a Demo</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500">© 2025 AI-Powered ATS. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default LearnMore;
