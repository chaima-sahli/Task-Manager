import { useState } from 'react';
import CalendarView from '../Calendar/CalendarView';

const DashboardHeader = ({ user, logout }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <>
      <header
        className="border-b-2 bg-[#FAF4E3] z-50 fixed top-0 left-0 right-0"
        style={{ borderColor: "#131214" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl transform -rotate-6">✨</div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">
                taskorbit
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
            {/* 🆕 Calendar Button */}
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="px-3 py-1.5 text-sm font-mono font-bold border-2 border-black bg-white hover:translate-x-0.5 hover:translate-y-0.5 transition"
              style={{ boxShadow: "2px 2px 0 0 #131214" }}
            >
              📅
            </button>
            
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
              className="px-4 py-2 text-sm font-mono font-bold border-2 border-black bg-white hover:translate-x-0.5 hover:translate-y-0.5 transition"
              style={{ boxShadow: "3px 3px 0 0 #131214" }}
            >
              [ sign out ]
            </button>
          </div>
        </div>
      </header>

      {/* Calendar Modal */}
      {showCalendar && (
        <div
          className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCalendar(false)}
        >
          <div
            className="bg-[#FAF4E3] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 border-2"
            style={{ borderColor: '#131214' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#131214' }}>
                📅 Calendar View
              </h2>
              <button
                onClick={() => setShowCalendar(false)}
                className="text-xl font-mono hover:opacity-100 transition"
                style={{ color: '#131214', opacity: 0.4 }}
              >
                ✕
              </button>
            </div>
            <CalendarView />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;