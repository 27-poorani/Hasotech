import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LeftNavigation from "../components/LeftNavigation";

const JobManagement = () => {
  const navigate = useNavigate();
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [newJobExperience, setNewJobExperience] = useState("");
  const [newJobSkills, setNewJobSkills] = useState("");
  const [newRecruiterEmail, setNewRecruiterEmail] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [technicalKnowledge, setTechnicalKnowledge] = useState("");
  const [attitudeRequired, setAttitudeRequired] = useState("");
  const [numberOfRounds, setNumberOfRounds] = useState(1);
  const [panelists, setPanelists] = useState({
    round1: { email: "", phoneNumber: "" },
    round2: { email: "", phoneNumber: "" },
    round3: { email: "", phoneNumber: "" },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token;

  useEffect(() => {
    if (!user?.token) {
      alert("Please login to manage jobs");
      navigate("/login");
    }
  }, [user, navigate]);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const handlePostJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate all required fields
      if (!user?._id) {
        throw new Error("Please login to post a job");
      }

      const requiredFields = [
        { field: newJobTitle, message: "Job title is required" },
        { field: newJobDescription, message: "Job description is required" },
        { field: newJobExperience, message: "Experience requirement is required" },
        { field: newJobSkills, message: "Skills are required" },
        { field: noticePeriod, message: "Notice period requirement is required" },
        { field: technicalKnowledge, message: "Technical knowledge requirements are required" },
        { field: attitudeRequired, message: "Attitude requirements are required" },
        { field: newRecruiterEmail, message: "Recruiter email is required" },
      ];

      for (const { field, message } of requiredFields) {
        if (!field?.trim()) {
          throw new Error(message);
        }
      }

      // Validate panelists for each round
      for (let i = 1; i <= numberOfRounds; i++) {
        const round = `round${i}`;
        if (!panelists[round]?.email?.trim() || !panelists[round]?.phoneNumber?.trim()) {
          throw new Error(`Please fill in all panelist details for round ${i}`);
        }
      }

      const jobData = {
        title: newJobTitle.trim(),
        description: newJobDescription.trim(),
        experience: newJobExperience.trim(),
        skillSet: newJobSkills.split(",").map((s) => s.trim()).filter(Boolean),
        recruiterEmail: newRecruiterEmail.trim(),
        createdBy: user._id,
        noticePeriod: noticePeriod.trim(),
        technicalKnowledge: technicalKnowledge.split(",").map((t) => t.trim()).filter(Boolean),
        attitudeRequired: attitudeRequired.trim(),
        numberOfRounds: Number(numberOfRounds),
        panelists: Object.fromEntries(
          [...Array(numberOfRounds)].map((_, i) => [
            `round${i + 1}`,
            panelists[`round${i + 1}`]
          ])
        )
      };

      const response = await axiosInstance.post("/jobs/create", jobData);

      if (response.data.success) {
        // Reset form
        setNewJobTitle("");
        setNewJobDescription("");
        setNewJobExperience("");
        setNewJobSkills("");
        setNewRecruiterEmail("");
        setNoticePeriod("");
        setTechnicalKnowledge("");
        setAttitudeRequired("");
        setNumberOfRounds(1);
        setPanelists({
          round1: { email: "", phoneNumber: "" },
          round2: { email: "", phoneNumber: "" },
          round3: { email: "", phoneNumber: "" },
        });
        
        // Navigate to job view page
        navigate(`/job-view/${response.data.data._id}`);
      }
    } catch (error) {
      console.error("Error creating job:", error);
      setError(error.response?.data?.message || error.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <LeftNavigation />
      
      <div className="flex-1 p-6 ml-64 pt-20">
        <div className="max-w-7xl mx-auto p-8 rounded-lg" style={{ 
          backgroundColor: '#242424',
          border: '1px solid #ffd700',
          boxShadow: '0 0 10px rgba(177, 150, 14, 0.2)'
        }}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: '#ffd700' }}>Post New Job</h1>
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
            </button>
          </div><br></br>
          <form onSubmit={handlePostJob} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Job Title*</label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Experience Required*</label>
                  <input
                    type="text"
                    value={newJobExperience}
                    onChange={(e) => setNewJobExperience(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Skills Required* (comma-separated)</label>
                  <input
                    type="text"
                    value={newJobSkills}
                    onChange={(e) => setNewJobSkills(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                    placeholder="e.g. React, Node.js, TypeScript"
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Notice Period*</label>
                  <input
                    type="text"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Technical Knowledge* (comma-separated)</label>
                  <input
                    type="text"
                    value={technicalKnowledge}
                    onChange={(e) => setTechnicalKnowledge(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Attitude Requirements*</label>
                  <input
                    type="text"
                    value={attitudeRequired}
                    onChange={(e) => setAttitudeRequired(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Recruiter Email*</label>
                  <input
                    type="email"
                    value={newRecruiterEmail}
                    onChange={(e) => setNewRecruiterEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Full Width Fields */}
            <div>
              <label className="block mb-2" style={{ color: '#ffd700' }}>Job Description*</label>
              <textarea
                value={newJobDescription}
                onChange={(e) => setNewJobDescription(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #ffd700'
                }}
                rows={4}
              />
            </div>

            {/* Number of Rounds */}
            <div>
              <label className="block mb-2" style={{ color: '#ffd700' }}>Number of Interview Rounds*</label>
              <select
                value={numberOfRounds}
                onChange={(e) => setNumberOfRounds(Number(e.target.value))}
                required
                className="w-full px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #ffd700'
                }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

            {/* Panelist Section */}
            {[...Array(numberOfRounds)].map((_, index) => (
              <div key={index} className="p-6 rounded-lg mb-4" style={{
                backgroundColor: '#333',
                border: '1px solid #ffd700'
              }}>
                <h3 className="text-xl font-medium mb-4" style={{ color: '#ffd700' }}>
                  Round {index + 1} Panelist*
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2" style={{ color: '#ffd700' }}>Email*</label>
                    <input
                      type="email"
                      value={panelists[`round${index + 1}`].email}
                      onChange={(e) => setPanelists(prev => ({
                        ...prev,
                        [`round${index + 1}`]: { ...prev[`round${index + 1}`], email: e.target.value }
                      }))}
                      required
                      className="w-full px-4 py-2 rounded-lg"
                      style={{
                        backgroundColor: '#333',
                        color: '#fff',
                        border: '1px solid #ffd700'
                      }}
                    />
                  </div>
                  <div>
                    <label className="block mb-2" style={{ color: '#ffd700' }}>Phone Number*</label>
                    <input
                      type="tel"
                      value={panelists[`round${index + 1}`].phoneNumber}
                      onChange={(e) => setPanelists(prev => ({
                        ...prev,
                        [`round${index + 1}`]: { ...prev[`round${index + 1}`], phoneNumber: e.target.value }
                      }))}
                      required
                      className="w-full px-4 py-2 rounded-lg"
                      style={{
                        backgroundColor: '#333',
                        color: '#fff',
                        border: '1px solid #ffd700'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg hover:bg-gray-800"
              style={{
                backgroundColor: '#333',
                color: '#ffd700',
                border: '1px solid #ffd700'
              }}
            >
              {loading ? 'Creating...' : 'Create Job'}
            </button>
             <button
              onClick={() => navigate("/recruiter-dashboard")}
              className="px-4 py-2 rounded-lg hover:bg-gray-800"
              style={{
                backgroundColor: '#333',
                color: '#ffd700',
                border: '1px solid #ffd700'
              }}
            >
                Publish Job to Naukri
            </button>

          
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobManagement;