import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks } from '../services/api';
import KanbanBoard from './KanbanBoard';
import DashboardStats from './DashboardStats';

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
    <div className="min-h-screen" style={{ backgroundColor: '#FAF4E3' }}>
      <header className="border-b-2" style={{ borderColor: '#131214' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✨</div>
            <h1 className="text-2xl font-bold" style={{ color: '#131214' }}>taskorbit</h1>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F6D76A' }}></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: '#131214', opacity: 0.7 }}>
              {user?.username}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm transition-all duration-200 hover:translate-x-0.5"
              style={{ border: '1px solid #131214', backgroundColor: 'white' }}
            >
              sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats now update when tasks change */}
        <DashboardStats tasks={tasks} />
        
        <div className="mt-8">
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