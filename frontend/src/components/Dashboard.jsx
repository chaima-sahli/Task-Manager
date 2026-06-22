import { useAuth } from "../contexts/AuthContext";
import DashboardStats from "./DashboardStats";
import KanbanBoard from "./KanbanBoard";
import { getTasks } from "../services/api";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { token, user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);




  const fetchTasks = async () => {
    try {
      const data = await getTasks(token);
      setTasks(data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  // Force refresh when tasks change
  const handleTasksUpdate = () => {
    fetchTasks();
  };


   if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF4E3' }}>
        <div className="text-center">
          <div className="text-4xl mb-2">🌀</div>
          <p style={{ color: '#131214', opacity: 0.7 }}>loading your orbit...</p>
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
        <DashboardStats tasks={tasks} />
        <div className='mt-8'>
            <KanbanBoard 
            tasks={tasks} 
            setTasks={setTasks}
            onTasksUpdate={handleTasksUpdate}
          />
        </div>
      </main>
    </div>
  );
};


export default Dashboard;
