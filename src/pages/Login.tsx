import { useState } from "react";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { LoginSocialGoogle } from "reactjs-social-login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [googleUser, setGoogleUser] = useState<{ id: string; email: string } | null>(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const showPopupMessage = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || !user.email || !user.password) {
      showPopupMessage("User not found! Please register first.");
      return;
    }

    if (user.email === email && user.password === password) {
      showPopupMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 2000);

    } else {
      showPopupMessage("Invalid credentials!");
    }
  };

  const handleGoogleSignIn = async (data: any) => {
    try {
      console.log("Full Google Sign-In Response:", data);

      // Check if we have proper response data
      if (!data?.provider || !data?.data) {
        throw new Error("No response data from Google");
      }

      // Extract user details from the response
      const userInfo = data.data;
      console.log("User Info:", userInfo);

      // Get email and ID from the response
      const email = userInfo.email;
      const userId = userInfo.id || userInfo.sub;
      const name = userInfo.name;

      if (!email || !userId) {
        throw new Error("Missing user details");
      }

      // Store user info in state
      setGoogleUser({ id: userId, email: email });

      // Show role selection before proceeding
      setShowRoleSelection(true);

      // Store basic info in localStorage
      localStorage.setItem("user", JSON.stringify({ 
        id: userId, 
        email: email,
        name: name,
        isGoogleAuth: true 
      }));

    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      showPopupMessage("Google Sign-In Failed: " + (error.message || "Unknown error"));
    }
  };

  const handleRoleSelection = () => {
    if (!selectedRole || !googleUser) {
      showPopupMessage("Please select a role.");
      return;
    }

    try {
      // Update user data with role
      const userData = {
        id: googleUser.id,
        email: googleUser.email,
        role: selectedRole,
        isGoogleAuth: true
      };

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      
      showPopupMessage("Login successful!");
      
      // Navigate based on role
      setTimeout(() => {
        switch (selectedRole) {
          case "recruiter":
            navigate("/recruiter-dashboard");
            break;
          case "interviewer":
            navigate("/interviewer-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      }, 1500);

    } catch (error) {
      console.error("Role selection error:", error);
      showPopupMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="login-box p-6 shadow-lg rounded-lg bg-white w-96">
        <div className="login-header text-center">
          <header className="text-2xl font-bold">Login</header>
        </div>
        <form onSubmit={handleLogin} className="space-y-2">
          <div>
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full p-3 border rounded-lg mt-1 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700">Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full p-3 border rounded-lg mt-1 focus:ring focus:ring-blue-300 outline-none pr-10"
              placeholder="Enter your password"
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
          <div className="forgot flex justify-between">
            <label className="flex items-center">
              <input type="checkbox" id="check" className="mr-2" />
              Remember me
            </label>
            <a href="/Reset-Password" className="forgot-link text-blue-500">Forgot password?</a>
          </div>
          <div className="input-box">
            <input type="submit" className="input-submit w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition" value="Login" />
          </div>
          <br />
          <div className="middle-text">
            <p className="or-text">Or</p>
          </div>
          <br />
          <LoginSocialGoogle 
            client_id="581671152109-k24ic0vmanl0e4qofuq733euvna5l70i.apps.googleusercontent.com"
            scope="profile email"
            onResolve={handleGoogleSignIn}
            onReject={(err: any) => {
              console.error("Google Login Failed:", err);
              showPopupMessage("Google Login Failed: " + (err?.message || "Unknown error"));
            }}
          >
            <div className="social-sign-in">
              <button className="input-google" type="button">
                <div className="width: 40px;">
                  <img src="googlelogo.jpg" alt=""/>
                </div>
                <p>Sign In with Google</p>
              </button>
            </div>
          </LoginSocialGoogle>
          <div className="sign-up">
            <p>Don't have an account? <a href="/Register">Sign up</a></p>
          </div>
        </form>

        {/* Role Selection Modal */}
        {showRoleSelection && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
                Select Your Role
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                Signed in as: {googleUser?.email}
              </p>
              <select 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-6"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">-- Select Role --</option>
                <option value="recruiter">Recruiter</option>
                <option value="interviewer">Interviewer</option>
                <option value="admin">Super Admin</option>
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
    </div>
  );
};

export default Login;
