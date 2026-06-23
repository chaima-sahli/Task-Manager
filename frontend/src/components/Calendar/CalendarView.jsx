import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTasks } from '../../services/api';
import toast from 'react-hot-toast';

const CalendarView = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showTaskList, setShowTaskList] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks(token);
      setTasks(data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  // Get tasks count for a date
  const getTaskCountForDate = (date) => {
    return getTasksForDate(date).length;
  };

  // Check if a date has tasks
  const hasTasksOnDate = (date) => {
    return getTaskCountForDate(date) > 0;
  };

  // Check if a date is overdue
  const isDateOverdue = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
  };

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
    setShowTaskList(false);
  };

  // Handle date click
  const handleDateClick = (date) => {
    const tasksForDate = getTasksForDate(date);
    if (tasksForDate.length > 0) {
      setSelectedDate(date);
      setSelectedTasks(tasksForDate);
      setShowTaskList(true);
    }
  };

  // Build calendar grid
  const buildCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }
    
    return days;
  };

  const calendarDays = buildCalendar();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-2xl animate-pulse" style={{ color: '#131214' }}>loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#131214' }}>
          📅 {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="px-4 py-2 border-2 transition hover:translate-x-0.5"
            style={{ borderColor: '#131214', backgroundColor: 'white' }}
          >
            ←
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 border-2 transition hover:translate-x-0.5"
            style={{ borderColor: '#131214', backgroundColor: '#F6D76A' }}
          >
            today
          </button>
          <button
            onClick={nextMonth}
            className="px-4 py-2 border-2 transition hover:translate-x-0.5"
            style={{ borderColor: '#131214', backgroundColor: 'white' }}
          >
            →
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold uppercase py-2"
            style={{ color: '#131214', opacity: 0.5 }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return (
              <div
                key={`empty-${index}`}
                className="aspect-square p-1"
                style={{ backgroundColor: '#FAF4E3' }}
              />
            );
          }

          const hasTasks = hasTasksOnDate(date);
          const taskCount = getTaskCountForDate(date);
          const overdue = isDateOverdue(date);
          const today = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={`aspect-square p-1 border-2 transition-all hover:translate-y-[-2px] relative ${
                today ? 'ring-2 ring-offset-1' : ''
              }`}
              style={{
                borderColor: today ? '#F6D76A' : '#131214',
                backgroundColor: hasTasks ? '#FDE8F3' : 'white',
                ringColor: '#F6D76A',
              }}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span
                  className={`text-sm font-medium ${
                    overdue ? 'text-red-500' : 'text-[#131214]'
                  }`}
                >
                  {date.getDate()}
                </span>
                {hasTasks && (
                  <div className="flex gap-0.5 mt-1">
                    {taskCount > 0 && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: overdue ? '#F7B7DA' : '#B6CAEC',
                          color: '#131214',
                        }}
                      >
                        {taskCount}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Date Task List */}
      {showTaskList && selectedDate && (
        <div className="mt-6 border-2 p-4" style={{ borderColor: '#131214', backgroundColor: 'white' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold" style={{ color: '#131214' }}>
              📌 Tasks for {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => setShowTaskList(false)}
              className="text-sm font-mono"
              style={{ color: '#131214', opacity: 0.4 }}
            >
              ✕ close
            </button>
          </div>
          <div className="space-y-2">
            {selectedTasks.map((task) => (
              <div
                key={task._id}
                className="p-3 border flex items-center justify-between"
                style={{ borderColor: '#131214' }}
              >
                <div>
                  <span className="font-medium" style={{ color: '#131214' }}>
                    {task.title}
                  </span>
                  <span className="text-xs ml-2" style={{ color: '#131214', opacity: 0.5 }}>
                    {task.status}
                  </span>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: task.priority === 'high' ? '#F7B7DA' :
                                     task.priority === 'medium' ? '#F6D76A' : '#B6CAEC',
                    color: '#131214',
                  }}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border" style={{ borderColor: '#131214', backgroundColor: '#FDE8F3' }} />
          <span style={{ color: '#131214', opacity: 0.5 }}>has tasks</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border" style={{ borderColor: '#131214', backgroundColor: '#F7B7DA' }} />
          <span style={{ color: '#131214', opacity: 0.5 }}>overdue</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-2" style={{ borderColor: '#F6D76A' }} />
          <span style={{ color: '#131214', opacity: 0.5 }}>today</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;