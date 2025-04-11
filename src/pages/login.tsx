import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
// @ts-ignore
import { LoginSocialGoogle } from "reactjs-social-login";
import { authenticateUser } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [googleUser, setGoogleUser] = useState<{ id: string; email: string; name: string; picture: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const showPopupMessage = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await authenticateUser(email, password);
      console.log("Login response:", data);

      if (data.success) {
        localStorage.setItem("user", JSON.stringify({
          ...data.data,
          token: data.data.token
        }));
        
        // Remove success popup and directly navigate
        const userRole = data.data.role.toLowerCase();
        switch (userRole) {
          case "recruiter":
            navigate("/recruiter-dashboard");
            break;
          case "interviewer":
            navigate("/interviewer-dashboard");
            break;
          case "super admin":
            navigate("/admin-dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      } else {
        showPopupMessage(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      showPopupMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
};

// Update Google Sign In handler
const handleGoogleSignIn = async (data: any) => {
    try {
      console.log("Google Sign-In Response:", data);

      if (!data?.provider || !data?.data) {
        throw new Error("No response data from Google");
      }

      const userInfo = data.data;
      console.log("User Info:", userInfo);

      // Extract user details
      const email = userInfo.email;
      const userId = userInfo.sub || userInfo.id;
      const name = userInfo.name;
      const picture = userInfo.picture;

      if (!email || !userId) {
        throw new Error("Missing user details");
      }

      // Instead of showing role selection, directly make API call with Recruiter role
      try {
        setLoading(true);
        
        const response = await fetch("http://localhost:8000/registration/google-signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: email,
            googleId: userId,
            name: name,
            role: "Recruiter", // Hardcoded role
            picture: picture,
            isGoogleAuth: true
          })
        });
    
        const data = await response.json();
        console.log("Google sign-in response:", data);
    
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.data));
          // Remove success popup and directly navigate
          navigate("/recruiter-dashboard");
        } else {
          showPopupMessage(data.message || "Google sign-in failed!");
        }
      } catch (error) {
        console.error("Google sign-in error:", error);
        showPopupMessage("Failed to complete sign-in. Please try again.");
      } finally {
        setLoading(false);
      }
  
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      showPopupMessage("Google Sign-In Failed: " + (error.message || "Unknown error"));
    }
  };

  const handleRoleSelection = async () => {
    if (!selectedRole || !googleUser) {
      showPopupMessage("Please select a role.");
      return;
    }

    try {
      setLoading(true);
      
      // Format role to match backend enum
      const formattedRole = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
      
      const response = await fetch("http://localhost:8000/registration/google-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: googleUser.email,
          googleId: googleUser.id,
          name: googleUser.name,
          role: formattedRole, // Send properly formatted role
          picture: googleUser.picture,
          isGoogleAuth: true
        })
      });

      const data = await response.json();
      console.log("Google sign-in response:", data);

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem("token", data.data.token);  // ✅ Save token
        console.log("Login successful, token saved:", data?.data?.token);

        localStorage.setItem("user", JSON.stringify(data.data));
        showPopupMessage("Login successful!");
        
        // Navigate based on role
        const userRole = data.data.role.toLowerCase();
        setTimeout(() => {
          switch (userRole) {
            case "recruiter":
              navigate("/recruiter-dashboard");
              break;
            case "interviewer":
              navigate("/interviewer-dashboard");
              break;
            case "super admin":
              navigate("/admin-dashboard");
              break;
            default:
              console.log("Unknown role:", userRole);
              navigate("/dashboard");
          }
        }, 1500);
      } else {
        showPopupMessage(data.message || "Google sign-in failed!");
      }
    } catch (error) {
      console.error("Role selection error:", error);
      showPopupMessage("Failed to complete sign-in. Please try again.");
    } finally {
      setLoading(false);
      setShowRoleSelection(false);
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
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center mb-8">
          <img
                src="atslogo.png"
                alt="Logo"
                className="mr-2 w-22 h-5"
              />            
          </div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-600 mb-4">Login</h2>
          <p className="text-gray-400 mb-8">Login to access your account</p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
              <input 
                className="w-full p-3 rounded bg-[#2e1e1e] text-white border border-gray-600 focus:outline-none focus:border-orange-400" 
                id="email" 
                placeholder="Email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
              <input 
                className="w-full p-3 rounded bg-[#2e1e1e] text-white border border-gray-600 focus:outline-none focus:border-orange-400 pr-10" 
                id="password" 
                placeholder="Password" 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img 
                src={showPassword ? "show.png" : "hide.png"} 
                alt="Toggle Password Visibility"
                className="absolute right-4 top-10 w-6 h-6 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-gray-400">
                <input className="form-checkbox text-orange-400 bg-[#2e1e1e] border-gray-600" type="checkbox"/>
                <span className="ml-2">Remember me</span>
              </label>
              <p className="text-gray-400 text-center mt-2">
                <a href="/forgot-password" className="text-orange-400 hover:underline">
                  Forgot Password?
                </a>
              </p>
            </div>
            <button className="w-full p-3 rounded bg-orange-400 text-white font-bold hover:bg-orange-500 transition duration-200" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-gray-400 mt-6">Don't have an account? <a className="text-orange-400" href="/Register">Sign up</a></p>
          <div className="mt-6">
            <LoginSocialGoogle 
              client_id="581671152109-k24ic0vmanl0e4qofuq733euvna5l70i.apps.googleusercontent.com"
              scope="profile email"
              onResolve={handleGoogleSignIn}
              onReject={(err: any) => {
                console.error("Google Login Failed:", err);
                showPopupMessage("Google Login Failed: " + (err?.message || "Unknown error"));
              }}
            >
               <button className="input-google" type="button">
                <div className="width: 40px;">
                  <img src="googlelogo.jpg" alt=""/>
                </div> <p>Continue with Google</p>
              </button>
            </LoginSocialGoogle>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <img alt="Abstract gradient background with overlapping circles" className="rounded-lg shadow-lg" height="600" src="https://storage.googleapis.com/a1aa/image/wngcAHf9zr0KerQw6g_xMfBxcjqj7YhfwLyql1ZdfuY.jpg" width="600"/>
        </div>
      </div>

      {/* Role Selection Modal */}
      {showRoleSelection && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Select Your Role</h3>
            <p className="text-gray-600 mb-6 text-center">Signed in as: {googleUser?.email}</p>
            <select 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-6"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">-- Select Role --</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Interviewer">Interviewer</option>
              <option value="Super Admin">Super Admin</option>
            </select>
            <div className="flex gap-3">
              <button 
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={handleRoleSelection}
              >
                Continue
              </button>
              <button 
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setShowRoleSelection(false);
                  setSelectedRole("");
                  setGoogleUser(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold">{popupMessage}</p>
            <center>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => setShowPopup(false)}>OK</button>
            </center>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
