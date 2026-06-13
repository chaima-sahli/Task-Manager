import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks } from '../services/api';
import DashboardStats from './DashboardStats';

const Dashboard = () => {
  const { token, user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks(token);
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF4E3' }}>
      {/* Header with personality */}
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
        {/* Stats with creative styling */}
        <DashboardStats tasks={tasks} />
        
        {/* Kanban board placeholder */}
        <div className="mt-8">
          <div className="grid grid-cols-3 gap-6">
            {['todo', 'inprogress', 'done'].map((column) => (
              <div key={column}>
                <div className="p-4 mb-4 border-2" style={{ borderColor: '#131214', backgroundColor: 'white' }}>
                  <h3 className="font-bold uppercase text-sm tracking-wide" style={{ color: '#131214', opacity: 0.7 }}>
                    {column === 'todo' ? 'waiting room' : column === 'inprogress' ? 'workshop' : 'archive'}
                  </h3>
                  <div className="mt-2 text-2xl font-bold" style={{ color: '#131214' }}>
                    {tasks.filter(t => t.status === column).length}
                  </div>
                </div>
                <div className="space-y-3">
                  {tasks.filter(t => t.status === column).map(task => (
                    <div key={task._id} className="p-4 border-2 transition-all duration-200 hover:translate-x-1" 
                         style={{ borderColor: '#131214', backgroundColor: 'white' }}>
                      <h4 className="font-medium" style={{ color: '#131214' }}>{task.title}</h4>
                      {task.description && (
                        <p className="text-sm mt-1" style={{ color: '#131214', opacity: 0.6 }}>{task.description}</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs px-2 py-1" style={{ 
                          backgroundColor: task.priority === 'high' ? '#F7B7DA' : '#B6CAEC',
                          border: '1px solid #131214'
                        }}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;