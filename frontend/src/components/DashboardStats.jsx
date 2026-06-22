const DashboardStats = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'inprogress').length,
    highPriority: tasks.filter(t => t.priority === 'high').length
  };

  const statCards = [
    { label: 'total', value: stats.total, icon: '📋', bg: '#FDE8F3' },
    { label: 'completed', value: stats.completed, icon: '✓', bg: '#E8F0FA' },
    { label: 'in progress', value: stats.inProgress, icon: '→', bg: '#FEF3D0' },
    { label: 'high priority', value: stats.highPriority, icon: '⚠', bg: '#FDE8F3' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {statCards.map((stat, idx) => (
        <div 
          key={idx}
          className="bg-white rounded-xl p-3.5 transition-all hover:translate-y-[-1px]"
          style={{ 
            boxShadow: '3px 3px 0 0 #131214',
            border: '2px solid #131214'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{stat.icon}</span>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#131214', opacity: 0.5 }}>
                {stat.label}
              </p>
            </div>
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center border-2"
              style={{ backgroundColor: stat.bg, borderColor: '#131214' }}
            >
              <span className="text-xs font-bold" style={{ color: '#131214' }}>{stat.value}</span>
            </div>
          </div>
          <p className="text-2xl font-black mt-1" style={{ color: '#131214' }}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;