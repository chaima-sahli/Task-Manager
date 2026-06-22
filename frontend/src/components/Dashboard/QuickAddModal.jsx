const QuickAddModal = ({ show, onClose, onAdd }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 border-2 max-w-md w-full mx-4"
        style={{ borderColor: "#131214" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold" style={{ color: "#131214" }}>
            Quick Add Task
          </h3>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-mono"
              style={{ color: "#131214", opacity: 0.25 }}
            >
              <kbd className="px-1 border border-current rounded">ESC</kbd> to
              close
            </span>
            <button
              onClick={onClose}
              className="text-xl font-mono hover:opacity-100 transition p-1"
              style={{ color: "#131214", opacity: 0.4 }}
            >
              ✕
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="What needs to be done?"
          className="w-full px-4 py-2.5 border-2 mb-3 bg-white transition-all duration-200"
          style={{ borderColor: "#131214" }}
          id="quickTaskTitle"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onAdd();
            }
            if (e.key === "Escape") {
              onClose();
            }
          }}
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 transition-all hover:translate-x-0.5"
            style={{ borderColor: "#131214" }}
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 border-2 font-medium transition-all hover:translate-x-0.5"
            style={{ backgroundColor: "#F6D76A", borderColor: "#131214" }}
          >
            Add Task →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;