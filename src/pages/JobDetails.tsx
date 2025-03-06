import { useNavigate, useParams } from "react-router-dom";

const jobList = [
  {
    id: 1,
    title: "Software Engineer",
    description: "Develop and maintain software solutions.",
    candidates: [
      { name: "Alice Johnson", email: "alice@example.com", resume: "alice_resume.pdf" },
      { name: "Bob Smith", email: "bob@example.com", resume: "bob_resume.pdf" },
      { name: "Charlie Brown", email: "charlie@example.com", resume: "charlie_resume.pdf" },
      { name: "David Williams", email: "david@example.com", resume: "david_resume.pdf" },
      { name: "Emma Watson", email: "emma@example.com", resume: "emma_resume.pdf" },
      { name: "Frank Martin", email: "frank@example.com", resume: "frank_resume.pdf" },
      { name: "Grace Kelly", email: "grace@example.com", resume: "grace_resume.pdf" },
      { name: "Henry Ford", email: "henry@example.com", resume: "henry_resume.pdf" },
      { name: "Ivy Green", email: "ivy@example.com", resume: "ivy_resume.pdf" },
      { name: "Jack White", email: "jack@example.com", resume: "jack_resume.pdf" },
    ],
  },
  {
    id: 2,
    title: "UI/UX Designer",
    description: "Create and improve user experience designs.",
    candidates: [
      { name: "Kate Adams", email: "kate@example.com", resume: "kate_resume.pdf" },
      { name: "Liam Scott", email: "liam@example.com", resume: "liam_resume.pdf" },
      { name: "Mia Davis", email: "mia@example.com", resume: "mia_resume.pdf" },
      { name: "Noah Wilson", email: "noah@example.com", resume: "noah_resume.pdf" },
      { name: "Olivia Brown", email: "olivia@example.com", resume: "olivia_resume.pdf" },
      { name: "Paul Harris", email: "paul@example.com", resume: "paul_resume.pdf" },
      { name: "Quincy Lee", email: "quincy@example.com", resume: "quincy_resume.pdf" },
      { name: "Rachel Adams", email: "rachel@example.com", resume: "rachel_resume.pdf" },
      { name: "Samuel Green", email: "samuel@example.com", resume: "samuel_resume.pdf" },
      { name: "Tina Turner", email: "tina@example.com", resume: "tina_resume.pdf" },
    ],
  },
];

const JobDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const job = jobList.find((job) => job.id === Number(id));

  if (!job) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-6 rounded-lg shadow-md border border-red-400">
          <h2 className="text-red-500 text-xl font-bold">Job not found.</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center  p-6">
<div className="bg-white shadow-lg p-8 rounded-2xl border border-gray-200 w-full max-w-7xl mx-auto e-card e-card-horizontal" style={{ width: `1000px` }}>
<h1 className="text-3xl font-extrabold text-gray-800">{job.title}</h1>
        <p className="mt-4 text-lg text-gray-600">{job.description}</p>
        <p className="mt-2 text-gray-500 font-medium">
          <span className="font-semibold text-gray-700">Total Candidates:</span> {job.candidates.length}
        </p>

        <h2 className="mt-6 text-xl font-semibold text-gray-800">Applied Candidates</h2>
        <div className="mt-4 overflow-auto max-h-96">
          <table className="w-full border-collapse border border-gray-300 rounded-lg text-center">
            <thead>
              <tr className="bg-blue-500">
                <th className="border border-gray-300 px-6 py-3 text-white">Name</th>
                <th className="border border-gray-300 px-6 py-3 text-white font-semibold">Email</th>
                <th className="border border-gray-300 px-6 py-3 text-white font-semibold">Resume</th>
              </tr>
            </thead>
            <tbody>
              {job.candidates.map((candidate, index) => (
                <tr key={index} className="border border-gray-300 hover:bg-gray-100 transition">
                  <td className="border border-gray-300 px-6 py-3 text-gray-700">{candidate.name}</td>
                  <td className="border border-gray-300 px-6 py-3 text-gray-600">{candidate.email}</td>
                  <td className="border border-gray-300 px-6 py-3 text-gray-600">
                    <a href="#" className="text-blue-500 hover:underline">View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition transform hover:scale-105"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
