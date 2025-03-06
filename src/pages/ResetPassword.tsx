import { useState } from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password reset link sent to your email!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-10 shadow-lg rounded-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Reset Password</h2>
        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <input type="submit" className="input-submit w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition" value="Send Reset Link" />
          </div>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 font-medium hover:underline text-lg">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
