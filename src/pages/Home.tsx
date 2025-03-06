import { Link } from "react-router-dom";
import { useState } from "react";

function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hello! How can I assist you today?", sender: "bot" }]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput(""); 
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "I'm here to help!", sender: "bot" }]); 
      }, 1000);
    }
  };

  return (
    
    <div className="w-full bg-white min-h-screen flex flex-col pt-80">
      {/* Hero Section */}
      <div className="flex-grow flex flex-row justify-between items-center px-8 md:px-20 py-30">
        {/* Left Side - Text */}
        <div className="w-1/2 text-left animate-fade-in-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Streamline & Organize Your Hiring Process
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-xl animate-slide-up">
            Automate resume screening, rank candidates, and simplify communication with our AI-driven Applicant Tracking System.
          </p>
          <div className="mt-6 flex space-x-4 animate-fade-in">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/learn-more"
              className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 flex justify-end">

          <img
            src="hand.jpg"
            alt="Hiring Process"
            className="w-3/4 rounded-lg animate-scale-up hover:scale-110 transition-transform duration-500 shadow-lg"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="flex justify-center gap-32 mt-10 px-4 md:px-16">
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-full sm:w-60 card">
          <img src="icon1.jpg" alt="Talent Quality" className="mx-auto mb-4 w-96" />
          <h3 className="text-lg font-semibold">Smart Resume Screening</h3>
          <p className="text-gray-600">
            Streamline your hiring process with AI-powered <br />resume analysis to spot top talent effortlessly.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center w-full sm:w-64 card">
          <img src="icon2.png" alt="Rank Candidates" className="mx-auto mb-4 w-90" />
          <h3 className="text-lg font-semibold">Effortless Candidate Ranking</h3>
          <p className="text-gray-600">
            Rank candidates based on skills and experience to prioritize the best fit for the job.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center w-full sm:w-64 card">
          <img src="icon3.jpg" alt="Enhance Engagement" className="mx-auto mb-4 w-65" />
          <h3 className="text-lg font-semibold">AI-Driven Candidate Matching</h3>
          <p className="text-gray-600">
            Match the right candidates with the perfect job using advanced AI algorithms for precision.
          </p>
        </div>
        
      </div>
      {/* {job} */}
      {/* <div className="w-1/2 flex justify-end">

<img
  src="job.png"
  alt="Hiring Process"
  className="w-3/4 rounded-lg animate-scale-up hover:scale-110 transition-transform duration-500 shadow-lg"
/>
</div> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-8 mt-10 w-full">
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

      {/* Chatbot Icon */}
      <button 
        className="fixed bottom-6 left-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center"
        onClick={() => setChatOpen(!chatOpen)}
      >
        💬
      </button>

      {/* Chatbot Window */}
      {chatOpen && (
        <div className="fixed bottom-24 left-6 bg-white shadow-xl rounded-lg w-80 p-4 flex flex-col">
          <div className="flex justify-between items-center border-b pb-2">
            <h4 className="text-lg font-semibold">I am here to help you</h4>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setChatOpen(false)}>✕</button>
          </div>
          <div className="h-40 overflow-y-auto p-2 text-gray-700 space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-200 text-right" : "bg-gray-200 text-left"}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="w-full border rounded-lg p-2 text-gray-700"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
