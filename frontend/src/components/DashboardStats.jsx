const DashboardStats = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'inprogress').length,
    highPriority: tasks.filter(t => t.priority === 'high').length
  };

  const statCards = [
    { label: 'total tasks', value: stats.total, icon: '📋' },
    { label: 'completed', value: stats.completed, icon: '✓' },
    { label: 'in progress', value: stats.inProgress, icon: '→' },
    { label: 'high priority', value: stats.highPriority, icon: '⚠' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statCards.map((stat, idx) => (
        <div key={idx} className="p-6 border-2 transition-all duration-200 hover:translate-y-[-4px]" 
             style={{ borderColor: '#131214', backgroundColor: 'white' }}>
          <div className="flex items-start justify-between mb-3">
            <div className="text-3xl">{stat.icon}</div>
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#F6D76A' }}></div>
          </div>
          <p className="text-sm uppercase tracking-wide mb-1" style={{ color: '#131214', opacity: 0.6 }}>
            {stat.label}
          </p>
          <p className="text-4xl font-bold" style={{ color: '#131214' }}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;