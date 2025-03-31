import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordReset } from '../firebase/authService';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const normalizedEmail = email.trim().toLowerCase();
            const result = await sendPasswordReset(normalizedEmail);
            
            if (result.success) {
                setMessage(`Reset link sent to ${normalizedEmail}. Please check both inbox and spam folders.`);
                console.log('Reset email sent to:', normalizedEmail);
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            console.error('Firebase error:', error);
            let errorMessage = "Failed to send reset email";
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = "If an account exists with this email, you will receive a password reset link";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Please enter a valid email address";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many attempts. Please try again later";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Network error. Please check your internet connection";
                    break;
                default:
                    errorMessage = error.message || "An error occurred. Please try again later.";
            }
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#242424] p-8 rounded-lg border border-[#ffd700]">
                <h2 className="text-2xl font-bold mb-6 text-[#ffd700] text-center">Forgot Password</h2>
                {message && (
                    <div className={`text-center mb-4 ${message.includes("sent") ? "text-green-400" : "text-red-400"}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[#ffd700] mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-[#333] text-white border border-[#ffd700] focus:outline-none"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 bg-[#ffd700] text-black rounded hover:bg-[#cca000] disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Send Reset Link"}
                    </button>
                    <p className="text-center text-white">
                        <a href="/login" className="text-[#ffd700] hover:underline">
                            Back to Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;