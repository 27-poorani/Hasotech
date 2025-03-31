import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const oobCode = new URLSearchParams(location.search).get('oobCode');

    // Modified email fetching logic
    useEffect(() => {
        const getEmailFromCode = async () => {
            if (!oobCode) {
                setMessage('Invalid reset link. Please request a new one.');
                return;
            }
            try {
                const auth = getAuth();
                const emailFromCode = await verifyPasswordResetCode(auth, oobCode);
                console.log('Email from reset code:', emailFromCode); // Debug log
                setEmail(emailFromCode);
            } catch (error: any) {
                console.error('Error verifying reset code:', error);
                setMessage('This password reset link has expired or is invalid.');
            }
        };
        getEmailFromCode();
    }, [oobCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!oobCode || !email) {
            setMessage('Invalid reset link. Request a new password reset.');
            return;
        }
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        
        setLoading(true);
        try {
            const auth = getAuth();
            await confirmPasswordReset(auth, oobCode, password);
            
            // Update MongoDB password with verified email
            console.log('Attempting to update password for email:', email); // Debug log
            const response = await fetch("http://localhost:8000/registration/users/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.toLowerCase(), // Ensure email is lowercase
                    password: password,
                    collection: 'users' // Specify the collection to search in
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update password in database');
            }

            const data = await response.json();
            console.log('Password reset response:', data);

            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error: any) {
            console.error('Reset error:', error);
            setMessage(error.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#242424] p-8 rounded-lg border border-[#ffd700]">
                <h2 className="text-2xl font-bold mb-6 text-[#ffd700] text-center">Reset Password</h2>
                {message && (
                    <div className={`text-center mb-4 ${message.includes("successful") ? "text-green-400" : "text-red-400"}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[#ffd700] mb-2">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-[#333] text-white border border-[#ffd700] focus:outline-none"
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label className="block text-[#ffd700] mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 rounded bg-[#333] text-white border border-[#ffd700] focus:outline-none"
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 bg-[#ffd700] text-black rounded hover:bg-[#cca000] disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
