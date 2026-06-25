import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTasks } from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AnalyticsDashboard = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week'); // 'week', 'month', 'all'

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks(token);
      setTasks(data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Status distribution for chart
  const statusData = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [
      {
        label: 'Tasks by Status',
        data: [todoTasks, inProgressTasks, completedTasks],
        backgroundColor: ['#F7B7DA', '#F6D76A', '#B6CAEC'],
        borderColor: '#131214',
        borderWidth: 2,
      },
    ],
  };

  // Priority distribution for chart
  const priorityData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [
          tasks.filter(t => t.priority === 'low').length,
          tasks.filter(t => t.priority === 'medium').length,
          tasks.filter(t => t.priority === 'high').length,
        ],
        backgroundColor: ['#B6CAEC', '#F6D76A', '#F7B7DA'],
        borderColor: '#131214',
        borderWidth: 2,
      },
    ],
  };

  // Due date distribution
  const getDueDateDistribution = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    let todayCount = 0;
    let tomorrowCount = 0;
    let thisWeekCount = 0;
    let overdueCount = 0;
    let noDateCount = 0;

    tasks.forEach(task => {
      if (!task.dueDate) {
        noDateCount++;
        return;
      }
      const dueDate = new Date(task.dueDate);
      const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

      if (dueDateOnly < today) {
        overdueCount++;
      } else if (dueDateOnly.getTime() === today.getTime()) {
        todayCount++;
      } else if (dueDateOnly.getTime() === tomorrow.getTime()) {
        tomorrowCount++;
      } else if (dueDateOnly >= today && dueDateOnly <= nextWeek) {
        thisWeekCount++;
      }
    });

    return {
      labels: ['Overdue', 'Today', 'Tomorrow', 'This Week', 'No Date'],
      data: [overdueCount, todayCount, tomorrowCount, thisWeekCount, noDateCount],
    };
  };

  const dueDateData = getDueDateDistribution();

  // Last 7 days completion trend
  const getCompletionTrend = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const completed = tasks.filter(t => {
        if (!t.updatedAt) return false;
        const updated = new Date(t.updatedAt);
        return t.status === 'done' && updated >= dayStart && updated < dayEnd;
      }).length;
      
      data.push(completed);
    }

    return {
      labels: days,
      data: data,
    };
  };

  const trendData = getCompletionTrend();

  // Top tags
  const getTopTags = () => {
    const tagMap = {};
    tasks.forEach(task => {
      if (task.tags && task.tags.length > 0) {
        task.tags.forEach(tag => {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const topTags = getTopTags();

  // Chart options with brutalist style
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#131214',
          font: { family: 'monospace', size: 11 },
          boxWidth: 12,
          padding: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#131214',
          lineWidth: 1,
        },
        ticks: {
          color: '#131214',
          font: { family: 'monospace', size: 10 },
        },
      },
      x: {
        grid: {
          color: '#131214',
          lineWidth: 1,
        },
        ticks: {
          color: '#131214',
          font: { family: 'monospace', size: 10 },
        },
      },
    },
  };

  const pieOptions = {
    ...chartOptions,
    scales: {},
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#131214',
          font: { family: 'monospace', size: 11 },
          boxWidth: 12,
          padding: 16,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-2xl animate-pulse" style={{ color: '#131214' }}>
          loading analytics...
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold" style={{ color: '#131214' }}>
          No tasks yet
        </h2>
        <p className="text-sm mt-2" style={{ color: '#131214', opacity: 0.5 }}>
          Create some tasks to see analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#131214' }}>
            📊 Analytics Dashboard
          </h2>
          <p className="text-sm" style={{ color: '#131214', opacity: 0.5 }}>
            Your task insights at a glance
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1 border-2 text-sm transition-all hover:translate-x-0.5 ${
              timeframe === 'week' ? 'bg-[#F6D76A]' : 'bg-white'
            }`}
            style={{ borderColor: '#131214' }}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 border-2 text-sm transition-all hover:translate-x-0.5 ${
              timeframe === 'month' ? 'bg-[#F6D76A]' : 'bg-white'
            }`}
            style={{ borderColor: '#131214' }}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1 border-2 text-sm transition-all hover:translate-x-0.5 ${
              timeframe === 'all' ? 'bg-[#F6D76A]' : 'bg-white'
            }`}
            style={{ borderColor: '#131214' }}
          >
            All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 border-2" style={{ borderColor: '#131214' }}>
          <div className="flex items-center justify-between">
            <span className="text-lg">📋</span>
            <span className="text-xs font-mono" style={{ color: '#131214', opacity: 0.4 }}>
              total
            </span>
          </div>
          <p className="text-3xl font-bold mt-1" style={{ color: '#131214' }}>
            {totalTasks}
          </p>
        </div>

        <div className="bg-white p-4 border-2" style={{ borderColor: '#131214' }}>
          <div className="flex items-center justify-between">
            <span className="text-lg">✓</span>
            <span className="text-xs font-mono" style={{ color: '#131214', opacity: 0.4 }}>
              done
            </span>
          </div>
          <p className="text-3xl font-bold mt-1" style={{ color: '#131214' }}>
            {completedTasks}
          </p>
          <span className="text-xs" style={{ color: '#131214', opacity: 0.5 }}>
            {completionRate}% completion rate
          </span>
        </div>

        <div className="bg-white p-4 border-2" style={{ borderColor: '#131214' }}>
          <div className="flex items-center justify-between">
            <span className="text-lg">⚠️</span>
            <span className="text-xs font-mono" style={{ color: '#131214', opacity: 0.4 }}>
              overdue
            </span>
          </div>
          <p className="text-3xl font-bold mt-1" style={{ color: '#131214' }}>
            {overdueTasks}
          </p>
          <span className="text-xs" style={{ color: '#131214', opacity: 0.5 }}>
            {overdueTasks > 0 ? '⚠️ Tasks past due' : '✨ All on track'}
          </span>
        </div>

        <div className="bg-white p-4 border-2" style={{ borderColor: '#131214' }}>
          <div className="flex items-center justify-between">
            <span className="text-lg">🔥</span>
            <span className="text-xs font-mono" style={{ color: '#131214', opacity: 0.4 }}>
              high priority
            </span>
          </div>
          <p className="text-3xl font-bold mt-1" style={{ color: '#131214' }}>
            {highPriorityTasks}
          </p>
          <span className="text-xs" style={{ color: '#131214', opacity: 0.5 }}>
            {highPriorityTasks > 0 ? '🔴 Need attention' : '✅ No urgent tasks'}
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-4 border-2" style={{ borderColor: '#131214' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: '#131214' }}>
            Status Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={statusData} options={pieOptions} />
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white p-4 border-2" style={{ borderColor: '#131214' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: '#131214' }}>
            Priority Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={priorityData} options={pieOptions} />
          </div>
        </div>

        {/* Completion Trend */}
        <div className="bg-white p-4 border-2" style={{ borderColor: '#131214' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: '#131214' }}>
            Last 7 Days Completion
          </h3>
          <div className="h-64">
            <Line
              data={{
                labels: trendData.labels,
                datasets: [
                  {
                    label: 'Tasks Completed',
                    data: trendData.data,
                    backgroundColor: '#F7B7DA',
                    borderColor: '#131214',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: false,
                    pointBackgroundColor: '#131214',
                    pointBorderColor: '#131214',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Due Date Distribution */}
        <div className="bg-white p-4 border-2" style={{ borderColor: '#131214' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: '#131214' }}>
            Due Date Distribution
          </h3>
          <div className="h-64">
            <Bar
              data={{
                labels: dueDateData.labels,
                datasets: [
                  {
                    label: 'Tasks',
                    data: dueDateData.data,
                    backgroundColor: ['#F7B7DA', '#F6D76A', '#B6CAEC', '#C9E4C5', '#E5E5E5'],
                    borderColor: '#131214',
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                ...chartOptions,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Tags */}
      {topTags.length > 0 && (
        <div className="bg-white p-4 border-2" style={{ borderColor: '#131214' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: '#131214' }}>
            🏷️ Top Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => {
              const colors = {
                work: '#B6CAEC',
                personal: '#F7B7DA',
                urgent: '#FF6B6B',
                important: '#F6D76A',
                idea: '#C9E4C5',
                project: '#A8D8EA',
                learning: '#D4A5FF',
                health: '#FFB7B2',
                finance: '#B5EAD7',
                home: '#FFDAC1',
              };
              const color = colors[tag] || '#E5E5E5';
              return (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border-2 font-medium"
                  style={{
                    backgroundColor: color,
                    borderColor: '#131214',
                    color: '#131214',
                  }}
                >
                  #{tag} ({count})
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;