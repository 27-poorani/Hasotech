
const LeftNavigation = () => {
  return (
    <div className="w-64 min-h-screen bg-white p-4 border-r border-gray-800 fixed left-0 top-18">
      <div className="flex items-center gap-2 mb-4">
        <img src="/atslo.png" alt="AIRecruiterX" className="w-25 h-8 " />
      </div>
      <div className="text-gray-500 text-xs mb-6">RECRUITMENT</div>

      <nav className="space-y-2">
        <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
          <a href="/dashboard" className="flex items-center text-gray-400">
            <span className="mr-3">⬚</span>
            Dashboard
          </a>
        </div>
        <div className="p-3 rounded-lg hover:bg-[#242424] transition-colors">
          <a href="/viewjobs" className="flex items-center text-gray-400">
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
  );
};

export default LeftNavigation;