const DashboardHeader = ({ user, logout }) => {
  return (
    <header
      className="border-b-2 bg-[var(--bg-primary)] z-50 fixed top-0 left-0 right-0"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl transform -rotate-6">✨</div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              taskor
            </h1>
            <p className="text-xs font-mono">organize the chaos</p>
          </div>
          <div className="w-2 h-2 bg-black rounded-full"></div>
          <div
            className="text-xs font-mono px-2 py-1 border-2 border-black"
            style={{ backgroundColor: "#F6D76A" }}
          >
            v1.0
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center text-xs font-black">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-mono font-bold">
              {user?.username}
            </span>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-mono font-bold border-2 border-black bg-white hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#131214] transition-all duration-200"
            style={{ boxShadow: "3px 3px 0 0 #131214" }}
          >
            [ sign out ]
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;