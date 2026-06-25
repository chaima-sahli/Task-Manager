import { useState } from "react";
import QuickAddModal from "./QuickAddModal";
import CalendarView from "../Calendar/CalendarView";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import AnalyticsDashboard from "../Analytics/AnalyticsDashboard";

const FloatingActionGroup = ({ onQuickAdd }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Use the consolidated keyboard shortcuts
  useKeyboardShortcuts({
    searchTerm: "",
    showQuickAdd,
    showCalendar,
    showAnalytics,
    showShortcuts,
    setSearchTerm: () => {}, 
    setShowQuickAdd,
    setShowCalendar,
    setShowAnalytics,
    setShowShortcuts,
  });

  // Keyboard shortcuts for quick reference
  const shortcuts = [
    { key: "n", action: "New task" },
    { key: "⌘F / Ctrl+F", action: "Focus search" },
    { key: "ESC", action: "Close modal / Clear search" },
    { key: "⌘N / Ctrl+N", action: "Quick add (fallback)" },
    { key: "⌘C / Ctrl+C", action: "Open Calendar" },
  ];

  return (
    <>
      {/* Floating Buttons Group */}
      <div className='fixed bottom-8 right-8 flex flex-col gap-3 z-40'>
        {/*  Analytics Button */}
        <button
          onClick={() => setShowAnalytics(true)}
          className='w-14 h-14 rounded-full border-2 shadow-[4px_4px_0_0_#131214] transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#131214] flex items-center justify-center text-2xl font-bold group relative'
          style={{
            backgroundColor: "#C9E4C5",
            borderColor: "#131214",
          }}
        >
          📊
        </button>

        {/* Calendar Button */}
        <button
          onClick={() => setShowCalendar(true)}
          className='w-14 h-14 rounded-full border-2 shadow-[4px_4px_0_0_#131214] transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#131214] flex items-center justify-center text-2xl font-bold group relative'
          style={{
            backgroundColor: "#B6CAEC",
            borderColor: "#131214",
          }}
        >
          📅
          <span className='absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white animate-pulse' />
        </button>

        {/* Keyboard Shortcuts Button */}
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className='w-14 h-14 rounded-full border-2 shadow-[4px_4px_0_0_#131214] transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#131214] flex items-center justify-center text-2xl font-bold'
          style={{
            backgroundColor: "#FDE8F3",
            borderColor: "#131214",
          }}
        >
          ⌨️
        </button>

        {/* Quick Add Button (existing) */}
        <button
          onClick={() => setShowQuickAdd(true)}
          className='w-14 h-14 rounded-full border-2 shadow-[4px_4px_0_0_#131214] transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#131214] flex items-center justify-center text-3xl font-bold group'
          style={{
            backgroundColor: "#F6D76A",
            borderColor: "#131214",
          }}
        >
          <span className='group-hover:hidden'>+</span>
          <span className='hidden group-hover:flex text-xs font-mono font-normal'>
            n
          </span>
        </button>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className='bg-white p-6 border-2 max-w-sm w-full mx-4'
            style={{ borderColor: "#131214" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-xl font-bold' style={{ color: "#131214" }}>
                ⌨️ Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className='text-xl font-mono hover:opacity-100 transition'
                style={{ color: "#131214", opacity: 0.4 }}
              >
                ✕
              </button>
            </div>
            <div className='space-y-2'>
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-2 border-b'
                  style={{ borderColor: "#E5E5E5" }}
                >
                  <span
                    className='text-sm'
                    style={{ color: "#131214", opacity: 0.6 }}
                  >
                    {shortcut.action}
                  </span>
                  <kbd
                    className='px-2 py-1 text-xs font-mono font-bold border-2'
                    style={{
                      borderColor: "#131214",
                      backgroundColor: "#FAF4E3",
                      color: "#131214",
                    }}
                  >
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
            <p
              className='text-xs mt-4 text-center'
              style={{ color: "#131214", opacity: 0.3 }}
            >
              Press ESC to close this modal
            </p>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendar && (
        <div
          className='fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={() => setShowCalendar(false)}
        >
          <div
            className='bg-[#FAF4E3] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 border-2'
            style={{ borderColor: "#131214" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold' style={{ color: "#131214" }}>
                📅 Calendar View
              </h2>
              <button
                onClick={() => setShowCalendar(false)}
                className='text-xl font-mono hover:opacity-100 transition'
                style={{ color: "#131214", opacity: 0.4 }}
              >
                ✕
              </button>
            </div>
            <CalendarView />
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      <QuickAddModal
        show={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onAdd={(taskData) => {
          onQuickAdd(taskData);
          setShowQuickAdd(false);
        }}
      />

      {/* Analytics Modal */}
      {showAnalytics && (
        <div
          className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={() => setShowAnalytics(false)}
        >
          <div
            className='bg-[#FAF4E3] max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 border-2'
            style={{ borderColor: "#131214" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold' style={{ color: "#131214" }}>
                📊 Analytics Dashboard
              </h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className='text-xl font-mono hover:opacity-100 transition'
                style={{ color: "#131214", opacity: 0.4 }}
              >
                ✕
              </button>
            </div>
            <AnalyticsDashboard />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingActionGroup;
