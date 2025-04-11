import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";


function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [role] = useState<string>("Recruiter");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate password before submission
    if (!validatePassword(password)) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/registration/adminsignup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          phone,
          role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black flex items-center justify-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-black relative">
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
      <div className="bg-black flex flex-col md:flex-row items-center justify-center p-8 md:p-16 rounded-lg shadow-lg bg-gradient-to-r from-black via-gray-900 to-black relative">
        <div className="bg-black p-8 rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-6xl bg-gradient-to-r from-black via-gray-900 to-black relative">
          {/* Left Side: Image */}
          <div className="flex-1 flex items-center justify-center p-8">
            <img
              src="https://storage.googleapis.com/a1aa/image/AouSrSVHfTLeJvWQoOLebdjjxMcTjpM5CYenjyrruZ4.jpg"
              alt="Signup Background"
              className="rounded-lg shadow-lg w-full max-w-md"
            />
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-8 text-white">
            <div className="flex items-center mb-6">
              <img
                src="atslogo.png"
                alt="Logo"
                className="mr-2 w-22 h-5"
              />
            </div>
            <h2 className="text-3xl text-orange-400 font-bold mb-2">Sign up</h2>
            <p className="text-gray-400 mb-6">Create your account</p>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSignUp} className="space-y-4">
              
             
              <div>
                <input
                  type="email"
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4 relative">
                <input 
                  className={`w-full p-3 rounded bg-[#2e1e1e] text-white border ${
                    passwordError ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:border-orange-400 pr-10`}
                  id="password" 
                  placeholder="Password (minimum 8 characters)" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  required
                />
                <img 
                  src={showPassword ? "show.png" : "hide.png"} 
                  alt="Toggle Password Visibility"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               
                <input
                  type="tel"
                  className="p-3 bg-gray-800 text-white rounded-lg focus:outline-none"
                  placeholder="phone(optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  pattern="[0-9]{10}"
                />
                 <input
                  type="text"
                  className="p-3 bg-gray-800 text-white rounded-lg focus:outline-none"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center mb-4">
                <input type="checkbox" className="mr-2" required />
                <p className="text-gray-400">
                  I agree to all the <a className="text-orange-400" href="#">Terms and Privacy Policy</a>
                </p>
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-orange-500 text-white rounded-lg focus:outline-none"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
              <p className="text-gray-400 text-center mt-4">
                Already have an account? <a className="text-orange-400" href="/login">Login here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;