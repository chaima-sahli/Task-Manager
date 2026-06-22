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

  // Filter tasks
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
      <DashboardHeader user={user} logout={logout} />

      <main className='max-w-7xl mx-auto px-6 pt-28 pb-8'>
        <DashboardStats tasks={filteredTasks} />

        <DashboardFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
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
