import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Recruiter"); 
  const [showPassword, setShowPassword] = useState(false);// Default role
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    // Store user data in localStorage (Replace with API call if using backend)
    localStorage.setItem("user", JSON.stringify({ 
      email, 
      password, 
      role,
      name,
      phone
    }));

    alert("Sign up successful! Please sign in.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="login-box login-box-register p-6 shadow-lg rounded-lg bg-white w-96">
        <div className="login-header text-center">
          <header className="text-2xl font-bold">Sign Up</header>
        </div>
        <form className="space-y-2" onSubmit={handleSignUp}>
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
          <div>
            <label className="block text-gray-700">Phone Number <span className="text-gray-500 text-sm">(Optional)</span></label>
            <input 
              type="tel" 
              className="w-full p-3 border rounded-lg mt-1 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
            />
          </div>
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-lg mt-1 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Select Role</label>
            <select 
              className="w-full p-3 border rounded-lg mt-1"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Recruiter">Recruiter</option>
              <option value="Interviewer">Interviewer</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>
          <br></br>
          <div className="input-box">
          <div className="input-box">
            <input type="submit" className="input-submit w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-900 transition" value="Sign up" />
          </div>
          </div>
          <div className="sign-up text-center mt-4">
            <p>Already have an account? <a href="/login" className="text-blue-500 hover:underline">Sign In</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
