import LeftNavigation from '../components/LeftNavigation';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const EditJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    experience: "",
    skillSet: "",
    recruiterEmail: "",
    noticePeriod: "",
  technicalKnowledge: "",
  attitudeRequired: "",
  numberOfRounds: 1,
  panelists: {
    round1: { email: "", phoneNumber: "" },
    round2: { email: "", phoneNumber: "" },
    round3: { email: "", phoneNumber: "" },
  }
  });

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user?.token;


  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });


  const fetchJobDetails = async () => {
    try {
      console.log("Fetching job with ID:", jobId);

      const userinLocalStorage = localStorage.getItem("user"); // ✅ Retrieve token)
      const user = userinLocalStorage ? JSON.parse(userinLocalStorage) : []
      const token = user.token;
      // if (!token) {
      //   console.error("❌ No token found! User must log in first."); 
      //   return;
      // }

      console.log("✅ Token:", token); // Debugging step

      console.log("Job Id",jobId)
      const response = await axiosInstance.post(`/jobs/${jobId}`);
      setJobData(response.data);

    } catch (err) {
      // setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;
      
      if (!token) {
        alert('Please login again');
        return;
      }
      
      const response = await axios.put(`http://localhost:8000/jobs/update/${jobId}`, {
        title: jobData.title,
        description: jobData.description,
        skillSet: jobData.skillSet,
        experience: jobData.experience,
        noticePeriod: jobData.noticePeriod,
        technicalKnowledge: jobData.technicalKnowledge,
        attitudeRequired: jobData.attitudeRequired,
        numberOfRounds: jobData.numberOfRounds,
        panelists: Object.fromEntries(
          [...Array(jobData.numberOfRounds)].map((_, i) => [
            `round${i + 1}`,
            jobData.panelists[`round${i + 1}`]
          ])
        )
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('Job updated successfully!');
        navigate('/recruiter-dashboard');
      }
    } catch (error: any) {
      console.error('Error updating job:', error);
      alert(error.response?.data?.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <LeftNavigation />
      
      {/* Main Content */}
      <div className="flex-1 p-6 ml-64 pt-20">
        <div className="max-w-4xl mx-auto p-8 rounded-lg" style={{ 
          backgroundColor: '#242424',
          border: '1px solid #ffd700',
          boxShadow: '0 0 10px rgba(177, 150, 14, 0.2)'
        }}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: '#ffd700' }}>Edit Job</h1>
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
          </div>

          {/* Split fields into two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2" style={{ color: '#ffd700' }}>Job Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #ffd700'
                  }}
                  value={jobData.title}
                  onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#ffd700' }}>Experience Required</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #ffd700'
                  }}
                  value={jobData.experience}
                  onChange={(e) => setJobData({ ...jobData, experience: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#ffd700' }}>Required Skills (comma separated)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #ffd700'
                  }}
                  value={jobData.skillSet}
                  onChange={(e) => setJobData({ ...jobData, skillSet: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#ffd700' }}>Notice Period</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #ffd700'
                  }}
                  value={jobData.noticePeriod}
                  onChange={(e) => setJobData({ ...jobData, noticePeriod: e.target.value })}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2" style={{ color: '#ffd700' }}>Technical Knowledge (comma separated)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #ffd700'
                  }}
                  value={jobData.technicalKnowledge}
                  onChange={(e) => setJobData({ ...jobData, technicalKnowledge: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#ffd700' }}>Attitude Required</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #ffd700'
                  }}
                  value={jobData.attitudeRequired}
                  onChange={(e) => setJobData({ ...jobData, attitudeRequired: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#ffd700' }}>Recruiter Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #ffd700'
                  }}
                  value={jobData.recruiterEmail}
                  onChange={(e) => setJobData({ ...jobData, recruiterEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#ffd700' }}>Number of Interview Rounds</label>
                <select
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #ffd700'
                  }}
                  value={jobData.numberOfRounds}
                  onChange={(e) => setJobData({ ...jobData, numberOfRounds: Number(e.target.value) })}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
            </div>
          </div>

          {/* Full width description field */}
          <div className="mt-6">
            <label className="block mb-2" style={{ color: '#ffd700' }}>Description</label>
            <textarea
              className="w-full px-4 py-2 rounded-lg"
              style={{
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #ffd700'
              }}
              rows={4}
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
            />
          </div>

          {/* Panelist section remains full width */}
          {[...Array(jobData.numberOfRounds)].map((_, index) => (
            <div key={index} className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(51, 51, 51, 0.5)' }}>
              <h3 className="text-xl font-medium mb-4" style={{ color: '#ffd700' }}>Round {index + 1} Panelist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                    value={jobData.panelists[`round${index + 1}`]?.email || ''}
                    onChange={(e) => setJobData(prev => ({
                      ...prev,
                      panelists: {
                        ...prev.panelists,
                        [`round${index + 1}`]: {
                          ...prev.panelists[`round${index + 1}`],
                          email: e.target.value
                        }
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block mb-2" style={{ color: '#ffd700' }}>Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #ffd700'
                    }}
                    value={jobData.panelists[`round${index + 1}`]?.phoneNumber || ''}
                    onChange={(e) => setJobData(prev => ({
                      ...prev,
                      panelists: {
                        ...prev.panelists,
                        [`round${index + 1}`]: {
                          ...prev.panelists[`round${index + 1}`],
                          phoneNumber: e.target.value
                        }
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Buttons remain the same */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleUpdate}
              className="px-6 py-2 rounded-lg hover:bg-gray-800"
              style={{
                backgroundColor: '#333',
                color: '#ffd700',
                border: '1px solid #ffd700'
              }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => navigate('/recruiter-dashboard')}
              className="px-6 py-2 rounded-lg hover:bg-gray-800"
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
    
  );
};

export default EditJob;