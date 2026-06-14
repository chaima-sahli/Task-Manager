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

  console.log(`Column ${column.id} isOver:`, isOver);

  const columnConfig = {
    todo: {
      title: 'To Do',
      icon: '○',
      bgColor: '#F7B7DA',
      bgLight: '#FDE8F3',
    },
    inprogress: {
      title: 'In Progress',
      icon: '◔',
      bgColor: '#F6D76A',
      bgLight: '#FEF3D0',
    },
    done: {
      title: 'Done',
      icon: '✓',
      bgColor: '#B6CAEC',
      bgLight: '#E8F0FA',
    }
  };

  const config = columnConfig[column.id];

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={setNodeRef}
        className={`bg-white rounded-2xl overflow-hidden transition-all duration-150 ${
          isOver ? 'ring-2 ring-black' : ''
        }`}
        style={{ 
          boxShadow: '6px 6px 0 0 #131214',
          border: '2px solid #131214'
        }}
      >
        <div className="p-4 border-b-2" style={{ backgroundColor: config.bgLight, borderColor: '#131214' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-xl">{config.icon}</div>
              <h3 className="font-bold" style={{ color: '#131214' }}>{config.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: '#131214' }}>{tasks.length}</span>
              <button
                onClick={onCreateTask}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:scale-105 transition font-bold"
                style={{ backgroundColor: config.bgColor, color: '#131214', border: '2px solid #131214' }}
              >
                <span className="text-lg">+</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 min-h-[500px] space-y-3">
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
            <div className="text-center py-12">
              <div className="text-3xl mb-2 opacity-40">◌</div>
              <p className="text-xs font-mono" style={{ color: '#131214', opacity: 0.4 }}>drop tasks here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Column;