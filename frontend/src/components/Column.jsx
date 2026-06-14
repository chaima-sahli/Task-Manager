import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const Column = ({ column, tasks, onCreateTask, onRefresh, token }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      status: column.id
    }
  });

  const columnConfig = {
    todo: {
      title: 'To Do',
      icon: '○',
      bgColor: '#F7B7DA',
      bgLight: '#FDE8F3',
      borderColor: '#E8A0C4'
    },
    inprogress: {
      title: 'In Progress',
      icon: '◔',
      bgColor: '#F6D76A',
      bgLight: '#FEF3D0',
      borderColor: '#E0C050'
    },
    done: {
      title: 'Done',
      icon: '✓',
      bgColor: '#B6CAEC',
      bgLight: '#E8F0FA',
      borderColor: '#8EACD4'
    }
  };

  const config = columnConfig[column.id];

  return (
    <div className="flex flex-col h-full">
      {/* Main Column Card */}
      <div 
        className="rounded-2xl overflow-hidden transition-all"
        style={{ 
          backgroundColor: config.bgLight,
          boxShadow: isOver ? '0 8px 20px rgba(0, 0, 0, 0.12)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
          transform: isOver ? 'scale(1.01)' : 'scale(1)'
        }}
      >
        {/* Column Header */}
        <div 
          className="p-5"
          style={{ backgroundColor: config.bgColor }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl mb-1">{config.icon}</div>
              <h3 className="font-bold text-xl" style={{ color: '#131214' }}>
                {config.title}
              </h3>
            </div>
            <button
              onClick={onCreateTask}
              className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-xl font-medium hover:scale-105 transition"
              style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}
            >
              +
            </button>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold">{tasks.length}</span>
            <span className="text-sm opacity-70">tasks</span>
          </div>
        </div>

        {/* Tasks Container */}
        <div
          ref={setNodeRef}
          className="p-4 min-h-[500px] space-y-3"
        >
          <SortableContext
            items={tasks.map(t => t._id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map(task => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onRefresh={onRefresh}
                token={token}
                columnColor={config.bgColor}
              />
            ))}
          </SortableContext>
          
          {tasks.length === 0 && (
            <div className="bg-white/60 rounded-xl p-8 text-center backdrop-blur-sm">
              <div className="text-3xl mb-2 opacity-40">◌</div>
              <p className="text-sm opacity-50">
                Drag tasks here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Column;