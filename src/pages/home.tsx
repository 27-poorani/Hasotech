import { Link } from "react-router-dom";
import { useState } from "react";

function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hello! How can I assist you today?", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "I'm here to help!", sender: "bot" }]);
      }, 1000);
    }
  };

  return (

    <div className="bg-black text-white overflow-hidden">
      {/* Header - updated styles */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="text-2xl font-extrabold tracking-wide flex items-center space-x-2">
            <span className="bg-gradient-to-r from-orange-400 to-purple-600 text-transparent bg-clip-text px-3 py-1">AI RecruiterX</span>
          </Link>

          {/* Navigation Links - updated styles */}
          <div className="space-x-6 text-lg font-medium">
            <Link to="/" className="text-white hover:text-gray-200 transition duration-300">
              Home
            </Link>
            <Link to="/login" className="text-white hover:text-gray-200 transition duration-300">
              Login
            </Link>
            <Link to="/register" className="text-white hover:text-gray-200 transition duration-300">
              Sign Up
            </Link>
            <Link to="/contact" className="text-white hover:text-gray-200 transition duration-300">
              Contact Us
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-orange-400 to-purple-600 px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-all hidden sm:inline-block"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section */}
        <section className="text-center py-20 bg-gradient-to-r from-black via-purple-900/20 to-black relative min-h-[350px] flex items-center">
        {/* Add a subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,...')]"></div>
        <div className="container mx-auto">
          // Update the Get Started button in the hero section
          <div className="max-w-[62rem] mx-auto text-center mb-20">
            <h1 className="text-5xl text-white md:text-6xl font-bold mb-6">
              AI RecruiterX <br /> The Future of Smart Hiring
            </h1>
            <p className="text-lg max-w-3xl mx-auto mb-6 text-gray-400">
              Reduce 80% time, shortlists the best candidates in seconds!
            </p>
            <Link
              to="/register"
              className="bg-yellow-500 text-black px-6 py-2 rounded-full hover:bg-yellow-600 inline-block"
            >
              Get Started
            </Link>
          </div>
          <div className="max-w-[23rem] mx-auto md:max-w-[40rem] lg:max-w-[55rem] xl:mb-24">
            <div className="p-0.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-500">
              <div className="bg-black rounded-[1rem] p-6">
                <h2 className="text-3xl font-bold mb-4 text-white">Attract New Leads</h2>
                <p className="text-black mb-4">
                  Discover the power of AI-driven recruitment and engagement.
                </p>
                <div className="mt-6 flex justify-center">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 w-64 rounded-l-lg border-none focus:outline-none text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button className="bg-orange-400 px-6 py-2 rounded-r-lg text-black">Attract</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>

        {/* Trusted Companies Section */}
        <section className="py-12">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Trusted by 200+ companies around the world</h2>
            <p className="text-gray-400 mb-8">
              Vulputate molestie molestie amet leo blandit accumsan. Sapien sed amet tellus purus sit odio eget. Diam morbi
              faucibus vitae neque id in. Nullam sed et dapibus nunc, porta enim orci urna, sit. Lectus se.
            </p>
            <div className="flex flex-wrap justify-center space-x-4">
              {[
                "https://storage.googleapis.com/a1aa/image/fI8XHQj0vXW60YAoF4-tfrI0FHFN6M6wf0d-WIUViOw.jpg",
                "https://storage.googleapis.com/a1aa/image/rdpD6ICJl8RU-GeNN-2aBWsza7ai2BK6VAQwgGP4--I.jpg",
                "https://storage.googleapis.com/a1aa/image/_9-7Qt7_4cP7QCLtyHCiEs5x59eAftpJ3yPdwC3G_6w.jpg",
                "https://storage.googleapis.com/a1aa/image/KexjboZb37Nh8ke-qN6T2OzjvYCfT907GsukISU4Ds8.jpg",
                "https://storage.googleapis.com/a1aa/image/wha861Jgtb1NGTlq4wwE8gsHHG0CfA4uGG-f1QDF4OQ.jpg",
                "https://storage.googleapis.com/a1aa/image/lQ1IbZ2ywfWPmSXvv2XECJCqrQIHwwtZomyKW7RlrKk.jpg",
                "https://storage.googleapis.com/a1aa/image/HJ3K7UA2FBsQIVSdH362odzms6SDZVa7ngLfrthAxNw.jpg",
                "https://storage.googleapis.com/a1aa/image/ffsfF-jBDeu_69ITu3MbnKPZhlYXT1Af9bD7UneD_ug.jpg",
                "https://storage.googleapis.com/a1aa/image/XIHkMm0pxdbkEqYSEIchNRWoZO8iW73l6ZLgrrzNAAg.jpg",
                "https://storage.googleapis.com/a1aa/image/XjBIb4jfaCvMachoUYW5B_QAZ6HgnYmkd8nU9Qjn1iE.jpg",
                "https://storage.googleapis.com/a1aa/image/N2Up6Y6bGwi7MzrE-fvYeaRC8mxwBpCZXBiTvc-k6SI.jpg",
                "https://storage.googleapis.com/a1aa/image/pugwaUJr_CcA1fr5pjstPf1k-WhO14_bceuztl2JosI.jpg",
              ].map((src, index) => (
                <img
                  key={index}
                  alt={`Company logo ${index + 1}`}
                  className="mb-4"
                  height="50"
                  src={src}
                  width="100"
                />
              ))}
            </div>
          </div>
        </section>

        {/* We Offer Section */}
        <section className="py-12 color-white bg-black-900">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl  text-white font-bold mb-4">We Offer</h2>
            <p className="text-white mb-8">
              Risus commodo id odio turpis pharetra elementum. Pulvinar porta porta feugiat scelerisque in elit. Morbi
              rhoncus, tellus, eros consequat magna semper orci a tincidunt.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: "https://storage.googleapis.com/a1aa/image/Y6TvtMCFlWoIV4kkbF4UP0XbZhn-2DN7ERmb_PMzqlo.jpg",
                  title: "AUTOMATING RESUME SCREENING",
                  description: "Egestas tellus nunc proin amet tellus tincidunt lacus consequat. Ultrices",
                },
                {
                  icon: "https://storage.googleapis.com/a1aa/image/bJaR3QP9tHXLxi6klupsds4jblZ2LNVcTqY-P4tpEoQ.jpg",
                  title: "RANKING CANDIDATES BASED ON JOB DESCRIPTIONS",
                  description: "Sed faucibus faucibus egestas volutpat, accumsan adipiscing egestas est. Auctor et leo urna est.",
                },
                {
                  icon: "https://storage.googleapis.com/a1aa/image/I1Son4N9dd68A76UMddYXDYTjZIsSBdGqLd08oPkjK8.jpg",
                  title: "PROVIDING SEAMLESS COMMUNICATION",
                  description: "Integer arcu non nunc, eget est justo vel semper nunc. Lacus",
                },
                {
                  icon: "https://storage.googleapis.com/a1aa/image/w9W6QWmbUWGpofoxFqYBSa6B8-Vhd6DTqZ4iQ2BgpGE.jpg",
                  title: "INTERVIEW SCHEDULING TOOLS FOR RECRUITERS.",
                  description: "Sed faucibus faucibus egestas volutpat, accumsan adipiscing egestas est. Auctor et leo urna est.",
                },
              ].map((item, index) => (
                <div key={index} className="border border-gray-700 p-6">
                  <img alt={`Icon ${index + 1}`} className="mb-4" height="50" src={item.icon} width="50" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                alt="Illustration of a person looking through binoculars"
                height="300"
                src="https://storage.googleapis.com/a1aa/image/skZuU0yOOWrbHqwMPdduv0Z4-PLmxNxbHY8A1MwIDt4.jpg"
                width="400"
              />
            </div>
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4 text-yellow-500">Why choose us</h2>
              <p className="text-gray-400 mb-8">
                Commodo diam vulputate ad proin quis enim nibh. Non integer ac libero facilisis hendrerit a elit. Nisi sem
                ut sed sed faucibus at eu elit. Morbi aliquam porttitor mattis consequat neque, tellus blandit.
              </p>
              <button className="bg-yellow-500 text-black px-6 py-3 rounded-full font-bold">LET'S CONNECT</button>
            </div>
          </div>
        </section>

        {/* Some Pieces of Our Work Section */}
        <section className="py-12 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Some pieces of our work</h2>
            <p className="text-gray-400 mb-8">
              Risus commodo id odio turpis pharetra elementum. Pulvinar porta porta feugiat scelerisque in elit. Morbi
              rhoncus, tellus, eros consequat magna semper orci a tincidunt.
            </p>
            <button className="bg-yellow-500 text-black px-6 py-3 rounded-full font-bold mb-8">SHOW MORE</button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  image: "https://storage.googleapis.com/a1aa/image/3F8bySYJ3xygwI1z8QQ7u_F3E3NxTbbP-0H4qa1okBo.jpg",
                  tag: "WEBSITE",
                  title: "Job Posting",
                },
                {
                  image: "https://storage.googleapis.com/a1aa/image/g4SICCbiavv2C7HJI8lglx01FVeFjcEEvaZq2vOIlGQ.jpg",
                  tag: "DIGITAL MARKETING",
                  title: "Candidate shortlisting",
                },
                {
                  image: "https://storage.googleapis.com/a1aa/image/aigEjNQ0SmvtaLMyleg5NPB6ZO0GB9Xg6F07T0jF6P4.jpg",
                  tag: "WEBSITE",
                  title: "Resume Screening",
                },
                {
                  image: "https://storage.googleapis.com/a1aa/image/alEK0hG6AhzDdCjH7w9Yg2-UK-tdP2ATqdWQxAr4GUc.jpg",
                  tag: "USER TESTING",
                  title: "Schedule Interview",
                },
                {
                  image: "https://storage.googleapis.com/a1aa/image/kbDizYa5_k36H9PiJqfkVDn6agvLvdSMsNjnAFWLiqM.jpg",
                  tag: "DEVELOPMENT",
                  title: "Automation in Tracking",
                },
                {
                  image: "https://storage.googleapis.com/a1aa/image/kSXDv8y1wDJ0GUq6tq6tCDTAyx2l20OeUh3tlGkpH7c.jpg",
                  tag: "SEO",
                  title: "How We Optimized Our Software",
                },
              ].map((item, index) => (
                <div key={index} className="border border-gray-700 p-6 rounded-xl hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-b from-gray-900 to-black">
                  <img alt={`Work example ${index + 1}`} className="mb-4" height="150" src={item.image} width="300" />
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-bold">{item.tag}</span>
                  <h3 className="text-xl font-bold mt-2">{item.title}</h3>
                  <p className="text-gray-400 mt-2">
                    Read more <i className="fas fa-arrow-right"></i>
                  </p>
                </div>
              ))}
            </div>
          </div>
          
        </section>
        {/* Add Footer */}
<footer className="bg-black text-white py-16 border-t border-gray-800">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-purple-600 text-transparent bg-clip-text">AI RecruiterX</h3>
        <p className="text-gray-400">Transforming recruitment with AI-powered solutions for modern businesses.</p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <i className="fab fa-linkedin text-xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <i className="fab fa-twitter text-xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <i className="fab fa-facebook text-xl"></i>
          </a>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2">
          <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
          <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
          <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
          <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Services</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resume Screening</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Candidate Ranking</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Interview Scheduling</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Analytics</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
        <p className="text-gray-400 mb-4">Stay updated with our latest features and releases.</p>
        <div className="flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button className="bg-gradient-to-r from-orange-400 to-purple-600 px-4 py-2 rounded-r-lg hover:opacity-90 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>

    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
      <p>&copy; {new Date().getFullYear()} AI RecruiterX. All rights reserved.</p>
    </div>
  </div>
</footer>
      </main>

      {/* Chatbot Icon and Window */}
      <button
        className="fixed bottom-6 left-6 bg-gradient-to-r from-orange-400 to-purple-600 text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-all flex items-center"
        onClick={() => setChatOpen(!chatOpen)}
      >
        💬
      </button>

      {chatOpen && (
        <div className="fixed bottom-24 left-6 bg-black/90 backdrop-blur-sm border border-white/10 shadow-xl rounded-lg w-80 p-4 flex flex-col">
          <div className="flex justify-between items-center border-b pb-2">
            <h4 className="text-lg font-semibold">I am here to help you</h4>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setChatOpen(false)}>
              ✕
            </button>
          </div>
          <div className="h-40 overflow-y-auto p-2 text-gray-700 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-200 text-right" : "bg-gray-200 text-left"}`}
              >
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

