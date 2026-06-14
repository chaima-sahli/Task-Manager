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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
      {statCards.map((stat, idx) => (
        <div 
          key={idx}
          className="bg-white rounded-2xl p-6 hover:transform hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          style={{ 
            boxShadow: '4px 4px 0 0 #131214',
            border: '2px solid #131214'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">{stat.icon}</span>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center border-2"
              style={{ backgroundColor: stat.bg, borderColor: '#131214' }}
            >
              <span className="text-sm font-bold" style={{ color: '#131214' }}>{stat.value}</span>
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#131214', opacity: 0.6 }}>{stat.label}</p>
          <p className="text-3xl font-black mt-1" style={{ color: '#131214' }}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;