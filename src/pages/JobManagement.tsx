import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JobManagement = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Software Engineer",
      description: "We are looking for a skilled software engineer to join our team.",
      experience: "3-5 years",
      skillSet: ["JavaScript", "React", "Node.js", "Git"],
      recruiterEmail: "recruiter@company.com"
    },
    {
      id: 2,
      title: "UI/UX Designer",
      description: "Looking for a creative UI/UX designer with strong portfolio.",
      experience: "2-4 years",
      skillSet: ["Figma", "Adobe XD", "User Research", "HTML & CSS"],
      recruiterEmail: "design.recruiter@company.com"
    },
  ]);
  
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [newJobExperience, setNewJobExperience] = useState("");
  const [newJobSkills, setNewJobSkills] = useState("");
  const [newRecruiterEmail, setNewRecruiterEmail] = useState("");
  const [editJobId, setEditJobId] = useState<number | null>(null);
  const [editJobTitle, setEditJobTitle] = useState("");
  const [editJobSkills, setEditJobSkills] = useState("");
  const [editJobOverview, setEditJobOverview] = useState("");
  const [showInputs, setShowInputs] = useState(false);

  const addJob = () => {
    if (!newJobTitle.trim()) {
      setShowInputs(true);
      return;
    }
    if (!newJobSkills.trim() || !newJobDescription.trim() || !newJobExperience.trim() || !newRecruiterEmail.trim()) return;

    setJobs([
      ...jobs,
      {
        id: Date.now(),
        title: newJobTitle,
        description: newJobDescription,
        experience: newJobExperience,
        skillSet: newJobSkills.split(",").map(skill => skill.trim()),
        recruiterEmail: newRecruiterEmail
      },
    ]);
    setNewJobTitle("");
    setNewJobDescription("");
    setNewJobExperience("");
    setNewJobSkills("");
    setNewRecruiterEmail("");
    setShowInputs(false);
  };

  const deleteJob = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const editJob = (id: number) => {
    const job = jobs.find(job => job.id === id);
    if (job) {
      setEditJobId(job.id);
      setEditJobTitle(job.title);
      setEditJobSkills(job.skillSet.join(", "));
      setEditJobOverview(job.description);
    }
  };

  const saveJob = () => {
    setJobs(jobs.map(job => 
      job.id === editJobId 
        ? { ...job, title: editJobTitle, skillSet: editJobSkills.split(",").map(skill => skill.trim()), description: editJobOverview }
        : job
    ));
    setEditJobId(null);
  };

  return (
    <div className="max-h-screen  p-6 pt-28">
      <div className="bg-white shadow-lg p-8 rounded-2xl border  w-full max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">Job Management</h1>
      </div>
      <br />
      <button
        onClick={() => navigate("/recruiter-dashboard")}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Back to Dashboard
      </button>
      
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Manage Job Listings</h2>
        
        {/* Post Job Button with Add Icon */}
        <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-2" onClick={addJob}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Post Job
        </button>

        <br />

        {/* Job Input Fields */}
        <div className="flex flex-col gap-2 mb-4">
         
          
          {showInputs && (
            <>
             <input
            type="text"
            className="px-4 py-2 rounded-lg border"
            placeholder="Enter job title"
            value={newJobTitle}
            onChange={(e) => setNewJobTitle(e.target.value)}
          />
              <textarea
                className="px-4 py-2 rounded-lg border"
                placeholder="Enter job description"
                value={newJobDescription}
                onChange={(e) => setNewJobDescription(e.target.value)}
              />
              <input
                type="text"
                className="px-4 py-2 rounded-lg border"
                placeholder="Experience required (e.g., 2-3 years)"
                value={newJobExperience}
                onChange={(e) => setNewJobExperience(e.target.value)}
              />
              <input
                type="text"
                className="px-4 py-2 rounded-lg border"
                placeholder="Required skills (comma separated)"
                value={newJobSkills}
                onChange={(e) => setNewJobSkills(e.target.value)}
              />
              <input
                type="email"
                className="px-4 py-2 rounded-lg border"
                placeholder="Recruiter email address"
                value={newRecruiterEmail}
                onChange={(e) => setNewRecruiterEmail(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Edit Job Section */}
        {editJobId && (
          <div className="flex flex-col gap-2 mb-4">
            <input
              type="text"
              className="px-4 py-2 rounded-lg"
              placeholder="Edit job title"
              value={editJobTitle}
              onChange={(e) => setEditJobTitle(e.target.value)}
            />
            <input
              type="text"
              className="px-4 py-2 rounded-lg"
              placeholder="Edit required skills (comma separated)"
              value={editJobSkills}
              onChange={(e) => setEditJobSkills(e.target.value)}
            />
            <textarea
              className="px-4 py-2 rounded-lg"
              placeholder="Edit job overview"
              value={editJobOverview}
              onChange={(e) => setEditJobOverview(e.target.value)}
            ></textarea>
            <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600" onClick={saveJob}>
              Save Job
            </button>
          </div>
        )}

        {/* Job Listings Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Job Title</th>
              <th className="border border-gray-300 px-4 py-2">Job Description</th>
              <th className="border border-gray-300 px-4 py-2">Experience Required</th>
              <th className="border border-gray-300 px-4 py-2">Skill Set</th>
              <th className="border border-gray-300 px-4 py-2">Recruiter Email</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border border-gray-300">
                <td className="border border-gray-300 px-4 py-2">{job.title}</td>
                <td className="border border-gray-300 px-4 py-2">{job.description}</td>
                <td className="border border-gray-300 px-4 py-2">{job.experience}</td>
                <td className="border border-gray-300 px-4 py-2">{job.skillSet.join(", ")}</td>
                <td className="border border-gray-300 px-4 py-2">{job.recruiterEmail}</td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                   <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    onClick={() => navigate(`/job-details/${job.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                    onClick={() => editJob(job.id)}
                  >
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600" onClick={() => deleteJob(job.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobManagement;
