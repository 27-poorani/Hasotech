import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-700 to-indigo-900 shadow-md text-white p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-wide flex items-center space-x-2">
          <span className="bg-white text-blue-600 px-3 py-1 rounded-lg shadow-md">ATS</span>
          <span className="hidden sm:inline">AI Hiring</span>
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 text-lg font-medium">
          <Link to="/" className="text-white hover:text-white-200 transition duration-300">Home</Link>
          <Link to="/login" className="text-white hover:text-white-200 transition duration-300">Login</Link>
          <Link to="/register" className="text-white hover:text-white-200 transition duration-300">Sign Up</Link>
          <Link to="/contact" className="text-white hover:text-white-200 transition duration-300">Contact Us</Link>
          <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-lg font-semibold hover:bg-gray-200 transition duration-300 hidden sm:inline-block">
          Get Started
        </Link>
        </div>

        {/* Call to Action */}
        

      </div>
    </nav>
  );
}

export default Navbar;
