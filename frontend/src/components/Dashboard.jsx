import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getTasks, createTask } from "../services/api";
import KanbanBoard from "./KanbanBoard";
import DashboardStats from "./DashboardStats";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { token, user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't handle if typing in input (except for Escape)
      const isInput =
        e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";

      // Ctrl+F or Cmd+F - Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
        return;
      }

      // Escape - Always close modal first, then clear search
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();

        if (showQuickAdd) {
          setShowQuickAdd(false);
          return;
        }

        if (searchTerm) {
          setSearchTerm("");
          return;
        }

        // O blur focus if nothing else
        if (document.activeElement) {
          document.activeElement.blur();
        }
        return;
      }

      if (e.key === "Backspace" && showQuickAdd) {
        const input = document.getElementById("quickTaskTitle");
        if (input && input.value === "") {
          e.preventDefault();
          setShowQuickAdd(false);
        }
      }

      // 'n' key alone - Quick add (only if not in input)
      if (
        e.key === "n" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !e.shiftKey
      ) {
        if (!isInput) {
          e.preventDefault();
          setShowQuickAdd(true);
          setTimeout(() => {
            document.getElementById("quickTaskTitle")?.focus();
          }, 100);
        }
      }

      // Ctrl+Shift+N - Fallback quick add
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "n") {
        e.preventDefault();
        e.stopPropagation();
        setShowQuickAdd(true);
        setTimeout(() => {
          document.getElementById("quickTaskTitle")?.focus();
        }, 100);
      }
    };

    // Use capture phase to catch escape before other handlers
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [searchTerm, showQuickAdd]);

  const fetchTasks = async () => {
    try {
      const data = await getTasks(token);
      setTasks(data || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddTask = async () => {
    const titleInput = document.getElementById("quickTaskTitle");
    const title = titleInput?.value.trim();

    if (!title) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      await createTask(token, {
        title: title,
        description: "",
        status: "todo",
        priority: "medium",
      });

      setShowQuickAdd(false);
      if (titleInput) titleInput.value = "";
      fetchTasks();
      toast.success("Task created! ✨");
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;

    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getStatusCount = (status) => {
    return tasks.filter((t) => t.status === status).length;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterPriority("all");
    setFilterStatus("all");
  };

  const hasActiveFilters =
    searchTerm !== "" || filterPriority !== "all" || filterStatus !== "all";

  if (loading) {
    return (
      <div
        className='min-h-screen flex items-center justify-center'
        style={{ backgroundColor: "#FAF4E3" }}
      >
        <div className='text-center'>
          <div className='text-4xl mb-2'>🌀</div>
          <p style={{ color: "#131214", opacity: 0.7 }}>
            loading your orbit...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen' style={{ backgroundColor: "#FAF4E3" }}>
      <header
        className='border-b-2 bg-[#FAF4E3] z-50 fixed top-0 left-0 right-0'
        style={{ borderColor: "#131214" }}
      >
        <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center flex-wrap gap-4'>
          <div className='flex items-center gap-4'>
            <div className='text-4xl transform -rotate-6'>✨</div>
            <div>
              <h1 className='text-3xl font-black uppercase tracking-tighter'>
                taskorbit
              </h1>
              <p className='text-xs font-mono'>organize the chaos</p>
            </div>
            <div className='w-2 h-2 bg-black rounded-full'></div>
            <div
              className='text-xs font-mono px-2 py-1 border-2 border-black'
              style={{ backgroundColor: "#F6D76A" }}
            >
              v1.0
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 border-2 border-black rounded-full flex items-center justify-center text-xs font-black'>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className='text-sm font-mono font-bold'>
                {user?.username}
              </span>
            </div>
            <button
              onClick={logout}
              className='px-4 py-2 text-sm font-mono font-bold border-2 border-black bg-white hover:translate-x-0.5 hover:translate-y-0.5 transition'
              style={{ boxShadow: "3px 3px 0 0 #131214" }}
            >
              [ sign out ]
            </button>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-6 pt-28 pb-8'>
        <DashboardStats tasks={filteredTasks} />

        {/* Search & Filter Bar */}
        <div className='mt-6 mb-8'>
          <div className='flex flex-wrap gap-3 items-end'>
            <div className='flex-1 min-w-[200px]'>
              <label
                className='block text-xs font-medium mb-1 uppercase tracking-wider'
                style={{ color: "#131214", opacity: 0.6 }}
              >
                search
              </label>
              <div className='relative'>
                <input
                  id='search-input'
                  type='text'
                  placeholder='find tasks... (⌘F)'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-4 py-2.5 border-2 bg-white transition-all duration-200'
                  style={{ borderColor: "#131214" }}
                  onFocus={(e) => (e.target.style.borderColor = "#F7B7DA")}
                  onBlur={(e) => (e.target.style.borderColor = "#131214")}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-sm font-mono'
                    style={{ color: "#131214", opacity: 0.4 }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className='min-w-[150px]'>
              <label
                className='block text-xs font-medium mb-1 uppercase tracking-wider'
                style={{ color: "#131214", opacity: 0.6 }}
              >
                priority
              </label>
              <div className='relative'>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className='w-full px-4 py-2.5 border-2 bg-white appearance-none transition-all duration-200 cursor-pointer'
                  style={{ borderColor: "#131214" }}
                  onFocus={(e) => (e.target.style.borderColor = "#F7B7DA")}
                  onBlur={(e) => (e.target.style.borderColor = "#131214")}
                >
                  <option value='all'>all priorities</option>
                  <option value='low'>♪ low</option>
                  <option value='medium'>♫ medium</option>
                  <option value='high'>♬ high</option>
                </select>
                <div
                  className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'
                  style={{ color: "#131214", opacity: 0.4 }}
                >
                  ▼
                </div>
              </div>
            </div>

            <div className='min-w-[150px]'>
              <label
                className='block text-xs font-medium mb-1 uppercase tracking-wider'
                style={{ color: "#131214", opacity: 0.6 }}
              >
                status
              </label>
              <div className='relative'>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='w-full px-4 py-2.5 border-2 bg-white appearance-none transition-all duration-200 cursor-pointer'
                  style={{ borderColor: "#131214" }}
                  onFocus={(e) => (e.target.style.borderColor = "#F7B7DA")}
                  onBlur={(e) => (e.target.style.borderColor = "#131214")}
                >
                  <option value='all'>all statuses</option>
                  <option value='todo'>to do ({getStatusCount("todo")})</option>
                  <option value='inprogress'>
                    in progress ({getStatusCount("inprogress")})
                  </option>
                  <option value='done'>done ({getStatusCount("done")})</option>
                </select>
                <div
                  className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'
                  style={{ color: "#131214", opacity: 0.4 }}
                >
                  ▼
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className='px-4 py-2.5 border-2 transition-all duration-200 hover:translate-x-0.5 font-medium'
                style={{ borderColor: "#131214", backgroundColor: "#FAF4E3" }}
              >
                ✕ clear
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <div className='flex flex-wrap gap-2 mt-3'>
              {searchTerm && (
                <span
                  className='text-xs px-3 py-1 border flex items-center gap-1'
                  style={{ borderColor: "#131214" }}
                >
                  <span>🔍</span> {searchTerm}
                </span>
              )}
              {filterPriority !== "all" && (
                <span
                  className='text-xs px-3 py-1 border flex items-center gap-1'
                  style={{ borderColor: "#131214" }}
                >
                  <span
                    className={
                      filterPriority === "high"
                        ? "text-pink-400"
                        : filterPriority === "medium"
                          ? "text-yellow-400"
                          : "text-blue-400"
                    }
                  >
                    {filterPriority === "high"
                      ? "♬"
                      : filterPriority === "medium"
                        ? "♫"
                        : "♪"}
                  </span>
                  {filterPriority}
                </span>
              )}
              {filterStatus !== "all" && (
                <span
                  className='text-xs px-3 py-1 border flex items-center gap-1'
                  style={{ borderColor: "#131214" }}
                >
                  <span>
                    {filterStatus === "todo"
                      ? "○"
                      : filterStatus === "inprogress"
                        ? "◔"
                        : "✓"}
                  </span>
                  {filterStatus}
                </span>
              )}
              <span
                className='text-xs px-3 py-1'
                style={{ color: "#131214", opacity: 0.5 }}
              >
                {filteredTasks.length} task
                {filteredTasks.length !== 1 ? "s" : ""} found
              </span>
            </div>
          )}
        </div>

        <KanbanBoard
          tasks={filteredTasks}
          onTasksUpdate={fetchTasks}
          allTasks={tasks}
        />
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className='fixed bottom-8 right-8 w-14 h-14 rounded-full border-2 shadow-[4px_4px_0_0_#131214] transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#131214] flex items-center justify-center text-3xl font-bold z-40'
        style={{
          backgroundColor: "#F6D76A",
          borderColor: "#131214",
        }}
      >
        +
      </button>

      {/* Keyboard shortcuts hint */}
      <div className='fixed bottom-8 left-8 hidden lg:block'>
        <div
          className='text-xs font-mono'
          style={{ color: "#131214", opacity: 0.25 }}
        >
          N new · ⌘F search · ESC close
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div
          className='fixed inset-0 bg-black/20 flex items-center justify-center z-50'
          onClick={() => setShowQuickAdd(false)}
        >
          <div
            className='bg-white p-6 border-2 max-w-md w-full mx-4'
            style={{ borderColor: "#131214" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-xl font-bold' style={{ color: "#131214" }}>
                Quick Add Task
              </h3>
              <div className='flex items-center gap-2'>
                <span
                  className='text-xs font-mono'
                  style={{ color: "#131214", opacity: 0.25 }}
                >
                  <kbd className='px-1 border border-current rounded'>ESC</kbd>{" "}
                  to close
                </span>
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className='text-xl font-mono hover:opacity-100 transition p-1'
                  style={{ color: "#131214", opacity: 0.4 }}
                >
                  ✕
                </button>
              </div>
            </div>

            <input
              type='text'
              placeholder='What needs to be done?'
              className='w-full px-4 py-2.5 border-2 mb-3 bg-white transition-all duration-200'
              style={{ borderColor: "#131214" }}
              id='quickTaskTitle'
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleQuickAddTask();
                }
                if (e.key === "Escape") {
                  setShowQuickAdd(false);
                }
              }}
            />

            <div className='flex gap-2'>
              <button
                onClick={() => setShowQuickAdd(false)}
                className='px-4 py-2 border-2 transition-all hover:translate-x-0.5'
                style={{ borderColor: "#131214" }}
              >
                Cancel
              </button>
              <button
                onClick={handleQuickAddTask}
                className='px-4 py-2 border-2 font-medium transition-all hover:translate-x-0.5'
                style={{ backgroundColor: "#F6D76A", borderColor: "#131214" }}
              >
                Add Task →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
