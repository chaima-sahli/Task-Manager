import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getTasks, createTask } from "../../services/api";
import KanbanBoard from "../KanbanBoard/KanbanBoard";
import DashboardStats from "../DashboardStats";
import DashboardHeader from "./DashboardHeader";
import DashboardFilters from "./DashboardFilters";
import QuickAddButton from "./QuickAddButton";
import QuickAddModal from "./QuickAddModal";
import KeyboardShortcuts from "./KeyboardShortcuts";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { token, user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDueDate, setFilterDueDate] = useState("all"); 
  const [sortBy, setSortBy] = useState("position"); 
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    searchTerm,
    showQuickAdd,
    setSearchTerm,
    setShowQuickAdd,
  });

  // Fetch tasks
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

  // Quick add task
  const handleQuickAddTask = async (taskData) => {
    const { title, dueDate } = taskData;
    
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
        dueDate: dueDate || null
      });

      setShowQuickAdd(false);
      fetchTasks();
      toast.success("Task created! ✨");
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
    }
  };

  //  Filter tasks by due date
  const filterTasksByDueDate = (tasks) => {
    if (filterDueDate === "all") return tasks;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return tasks.filter(task => {
      if (!task.dueDate) return filterDueDate === "no-date";
      
      const dueDate = new Date(task.dueDate);
      const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
      
      switch (filterDueDate) {
        case "today":
          return dueDateOnly.getTime() === today.getTime();
        case "tomorrow":
          return dueDateOnly.getTime() === tomorrow.getTime();
        case "this-week":
          return dueDateOnly >= today && dueDateOnly <= nextWeek;
        case "overdue":
          return dueDateOnly < today;
        case "no-date":
          return !task.dueDate;
        default:
          return true;
      }
    });
  };

  //  Sort tasks
  const sortTasks = (tasks) => {
    const sorted = [...tasks];
    
    switch (sortBy) {
      case "due-date":
        return sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      case "due-date-desc":
        return sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        });
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default: // position
        return sorted.sort((a, b) => a.position - b.position);
    }
  };

  // Apply filters and sorting
  const getFilteredAndSortedTasks = () => {
    let result = [...tasks];
    
    // Search filter
    result = result.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });

    // Priority filter
    if (filterPriority !== "all") {
      result = result.filter((task) => task.priority === filterPriority);
    }

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter((task) => task.status === filterStatus);
    }

    // Due date filter
    result = filterTasksByDueDate(result);

    // Sort
    result = sortTasks(result);

    return result;
  };

  const filteredTasks = getFilteredAndSortedTasks();

  const getStatusCount = (status) => {
    return tasks.filter((t) => t.status === status).length;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterPriority("all");
    setFilterStatus("all");
    setFilterDueDate("all");
    setSortBy("position");
  };

  const hasActiveFilters =
    searchTerm !== "" || 
    filterPriority !== "all" || 
    filterStatus !== "all" || 
    filterDueDate !== "all" ||
    sortBy !== "position";

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FAF4E3" }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">🌀</div>
          <p style={{ color: "#131214", opacity: 0.7 }}>
            loading your orbit...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF4E3" }}>
      <DashboardHeader user={user} logout={logout} />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-8">
        <DashboardStats tasks={filteredTasks} />

        <DashboardFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterDueDate={filterDueDate} // 
          setFilterDueDate={setFilterDueDate} // 
          sortBy={sortBy} // 
          setSortBy={setSortBy} // 
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          getStatusCount={getStatusCount}
          filteredTasksCount={filteredTasks.length}
        />

        <KanbanBoard
          tasks={filteredTasks}
          onTasksUpdate={fetchTasks}
          allTasks={tasks}
        />
      </main>

      <QuickAddButton onClick={() => setShowQuickAdd(true)} />
      <KeyboardShortcuts />

      <QuickAddModal
        show={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onAdd={handleQuickAddTask}
      />
    </div>
  );
};

export default Dashboard;