const DashboardStats = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'inprogress').length,
    highPriority: tasks.filter(t => t.priority === 'high').length
  };

  const statCards = [
    { label: 'Total', value: stats.total, icon: '📋', bg: '#F7B7DA' },
    { label: 'Completed', value: stats.completed, icon: '✓', bg: '#B6CAEC' },
    { label: 'In Progress', value: stats.inProgress, icon: '→', bg: '#F6D76A' },
    { label: 'High Priority', value: stats.highPriority, icon: '⚠', bg: '#F7B7DA' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, idx) => (
        <div 
          key={idx}
          className="bg-white rounded-xl p-5"
          style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{stat.icon}</span>
            <div 
              className="w-8 h-8 rounded-full opacity-20"
              style={{ backgroundColor: stat.bg }}
            ></div>
          </div>
          <p className="text-2xl font-bold mb-0.5">{stat.value}</p>
          <p className="text-xs opacity-60">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;