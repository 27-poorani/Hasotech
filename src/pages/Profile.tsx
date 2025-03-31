import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone: string;
    role: string;
    token?: string;
  } | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditedUser({
        name: parsedUser.name,
        email: parsedUser.email,
        phone: parsedUser.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSaveProfile = async () => {
    if (user) {
        try {
            const response = await axios.put('http://localhost:8000/registration/users/update', 
                {
                    name: editedUser.name,
                    email: user.email,  // Use the original email
                    phone: editedUser.phone
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                const updatedUser = {
                    ...user,
                    ...response.data.user
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                setIsEditing(false);
                alert('Profile updated successfully!');
            }
        } catch (error: any) {
            console.error('Update error:', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        }
    }
};

  // Also update the password change endpoint
  const handlePasswordChange = async () => {
    if (editedUser.newPassword !== editedUser.confirmPassword) {
        alert("New passwords don't match!");
        return;
    }

    try {
        const response = await axios.put('http://localhost:8000/registration/users/change-password',
            {
                email: user?.email,
                currentPassword: editedUser.currentPassword,
                newPassword: editedUser.newPassword
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.success) {
            alert("Password changed successfully!");
            setShowPasswordChange(false);
            setEditedUser({
                ...editedUser,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    } catch (error: any) {
        console.error('Password change error:', error);
        alert(error.response?.data?.message || 'Failed to change password');
    }
};

  // Add logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-6 pt-28" style={{ backgroundColor: 'black' }}>
      {/* Left Navigation */}
      <div className="w-64 min-h-screen bg-black p-4 border-r border-gray-800 fixed left-0 top-0">
        <div className="flex items-center gap-2 mb-4">
          <img src="/ai.jpg" alt="ATS" className="w-25 h-8" />
        </div>
        <div className="text-gray-500 text-xs mb-6">RECRUITMENT</div>

        <nav className="space-y-2">
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-orange-500">
            <a href="/dashboard" className="flex items-center text-white">
              <span className="mr-3">⬚</span>
              Dashboard
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/jobs" className="flex items-center text-gray-400">
              <span className="mr-3">📋</span>
              Jobs
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/ai-screening" className="flex items-center text-gray-400">
              <span className="mr-3">👥</span>
              Candidates
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/resumescreen" className="flex items-center text-gray-400">
              <span className="mr-3">🔍</span>
              Screening
            </a>
          </div>
          <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
            <a href="/schedule-interview" className="flex items-center text-gray-400">
              <span className="mr-3">💬</span>
              Interviews
            </a>
          </div>
          
        </nav>
      </div>
      {user ? (
        <div className="max-w-3xl mx-auto p-8 rounded-xl" style={{ 
          backgroundColor: 'black',
          border: '1px solid #ffd700',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
        }}>
          <div className="text-center mb-8">
            {!isEditing ? (
              <>
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ 
                    backgroundColor: '#333',
                    border: '2px solid #ffd700'
                  }}>
                    <span className="text-3xl" style={{ color: '#ffd700' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-3xl font-semibold mb-4" style={{ color: '#ffd700' }}>{user.name}</h2>
                  <div className="space-y-3">
                    <p style={{ color: '#fff' }} className="text-lg">
                      <span style={{ color: '#ffd700' }}>Email: </span>{user.email}
                    </p>
                    <p style={{ color: '#fff' }} className="text-lg">
                      <span style={{ color: '#ffd700' }}>Phone: </span>{user.phone || 'No phone number added'}
                    </p>
                    <p style={{ color: '#fff' }} className="text-lg">
                      <span style={{ color: '#ffd700' }}>Role: </span>{user.role}
                    </p>
                  </div>
                </div>
                <button
        onClick={() => navigate("/recruiter-dashboard")}
        className="px-4 py-2 rounded-lg hover:bg-gray-800"
        style={{
          backgroundColor: '#333',
          color: '#ffd700',
          border: '1px solid #ffd700'
        }}
      >
        Back to Dashboard
      </button><br></br>
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-48 px-6 py-3 rounded-lg transition-all duration-300 hover:bg-[#ffd700] hover:text-black"
                    style={{
                      backgroundColor: '#333',
                      color: '#ffd700',
                      border: '1px solid #ffd700'
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowPasswordChange(true)}
                    className="w-48 px-6 py-3 rounded-lg transition-all duration-300 hover:bg-[#ffd700] hover:text-black"
                    style={{
                      backgroundColor: '#333',
                      color: '#ffd700',
                      border: '1px solid #ffd700'
                    }}
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-48 px-6 py-3 rounded-lg transition-all duration-300 hover:bg-red-600 hover:border-red-600"
                    style={{
                      backgroundColor: '#333',
                      color: '#ffd700',
                      border: '1px solid #ffd700'
                    }}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold mb-6" style={{ color: '#ffd700' }}>Edit Profile</h3>
                <div className="space-y-6">
                  <div className="text-left">
                    <label className="block mb-2 text-lg" style={{ color: '#ffd700' }}>Name</label>
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      className="w-full p-3 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[#ffd700]"
                      style={{
                        backgroundColor: '#333',
                        color: '#fff',
                        border: '1px solid #ffd700'
                      }}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block mb-2 text-lg" style={{ color: '#ffd700' }}>Email</label>
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="w-full p-3 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[#ffd700]"
                      style={{
                        backgroundColor: '#333',
                        color: '#fff',
                        border: '1px solid #ffd700'
                      }}
                      required
                      disabled
                    />
                  </div>
                  <div className="text-left">
                    <label className="block mb-2 text-lg" style={{ color: '#ffd700' }}>Phone</label>
                    <input
                      type="tel"
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      className="w-full p-3 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[#ffd700]"
                      style={{
                        backgroundColor: '#333',
                        color: '#fff',
                        border: '1px solid #ffd700'
                      }}
                      pattern="[0-9]{10}"
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                  <div className="flex gap-4 justify-center mt-8">
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-3 rounded-lg transition-all duration-300 hover:bg-[#ffd700] hover:text-black"
                      style={{
                        backgroundColor: '#333',
                        color: '#ffd700',
                        border: '1px solid #ffd700'
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 rounded-lg transition-all duration-300 hover:bg-gray-700"
                      style={{
                        backgroundColor: '#333',
                        color: '#ffd700',
                        border: '1px solid #ffd700'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Password Change Modal */}
          {showPasswordChange && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="bg-[#242424] p-8 rounded-xl max-w-md w-full mx-4 border border-[#ffd700]">
                <h3 className="text-2xl font-semibold mb-6 text-center" style={{ color: '#ffd700' }}>Change Password</h3>
                <div className="space-y-6">
                  <div className="text-left">
                    <label className="block mb-2 text-lg" style={{ color: '#ffd700' }}>Current Password</label>
                    <input
                      type="password"
                      value={editedUser.currentPassword}
                      onChange={(e) => setEditedUser({ ...editedUser, currentPassword: e.target.value })}
                      className="w-full p-3 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[#ffd700]"
                      style={{
                        backgroundColor: '#333',
                        color: '#fff',
                        border: '1px solid #ffd700'
                      }}
                    />
                  </div>
                  <div className="text-left">
                    <label className="block mb-2 text-lg" style={{ color: '#ffd700' }}>New Password</label>
                    <input
                      type="password"
                      value={editedUser.newPassword}
                      onChange={(e) => setEditedUser({ ...editedUser, newPassword: e.target.value })}
                      className="w-full p-3 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[#ffd700]"
                      style={{
                        backgroundColor: '#333',
                        color: '#fff',
                        border: '1px solid #ffd700'
                      }}
                    />
                  </div>
                  <div className="text-left">
                    <label className="block mb-2 text-lg" style={{ color: '#ffd700' }}>Confirm Password</label>
                    <input
                      type="password"
                      value={editedUser.confirmPassword}
                      onChange={(e) => setEditedUser({ ...editedUser, confirmPassword: e.target.value })}
                      className="w-full p-3 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[#ffd700]"
                      style={{
                        backgroundColor: '#333',
                        color: '#fff',
                        border: '1px solid #ffd700'
                      }}
                    />
                  </div>
                  <div className="flex gap-4 justify-center mt-8">
                    <button
                      onClick={handlePasswordChange}
                      className="px-6 py-3 rounded-lg transition-all duration-300 hover:bg-[#ffd700] hover:text-black"
                      style={{
                        backgroundColor: '#333',
                        color: '#ffd700',
                        border: '1px solid #ffd700'
                      }}
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordChange(false);
                        setEditedUser({
                          ...editedUser,
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="px-6 py-3 rounded-lg transition-all duration-300 hover:bg-gray-700"
                      style={{
                        backgroundColor: '#333',
                        color: '#ffd700',
                        border: '1px solid #ffd700'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p style={{ color: '#ffd700' }}>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
