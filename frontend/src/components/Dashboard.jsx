import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getTasks } from "../services/api";
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+F or Cmd+F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
      // Escape to clear search
      if (e.key === "Escape" && searchTerm) {
        setSearchTerm("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchTerm]);

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

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Priority filter
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;

    // Status filter
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Get counts for filter badges
  const getStatusCount = (status) => {
    return tasks.filter((t) => t.status === status).length;
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterPriority("all");
    setFilterStatus("all");
  };

  // Check if any filters are active
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
        className='border-b-4 border-black mb-8'
        style={{ backgroundColor: "white" }}
      >
        <div className='max-w-7xl mx-auto px-6 py-5 flex justify-between items-center'>
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

      <main className='max-w-7xl mx-auto px-6 py-8'>
        {/* Stats */}
        <DashboardStats tasks={filteredTasks} />

        {/* Search & Filter Bar */}
        <div className='mt-6 mb-8'>
          <div className='flex flex-wrap gap-3 items-end'>
            {/* Search Input */}
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

            {/* Priority Filter */}
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

            {/* Status Filter */}
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

            {/* Clear Filters Button */}
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

          {/* Active Filters Display */}
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

        {/* Kanban Board with filtered tasks */}
        <KanbanBoard
          tasks={filteredTasks}
          onTasksUpdate={fetchTasks}
          allTasks={tasks}
        />
      </main>
    </div>
  );
};

export default Dashboard;
