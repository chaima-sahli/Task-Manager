import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updateTask, deleteTask } from '../services/api';
import toast from 'react-hot-toast';

const TaskCard = ({ task, onRefresh, token, columnColor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority || 'medium');
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: task._id,
    data: {
      type: 'task',
      task
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityConfig = {
    low: { text: 'Low', icon: '♪', color: '#B6CAEC' },
    medium: { text: 'Medium', icon: '♫', color: '#F6D76A' },
    high: { text: 'High', icon: '♬', color: '#F7B7DA' }
  };

  const currentPriority = priorityConfig[task.priority];

  const handleUpdate = async () => {
    try {
      await updateTask(token, task._id, {
        title: editTitle,
        description: editDescription,
        priority: editPriority
      });
      setIsEditing(false);
      onRefresh();
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Delete clicked for task:', task._id);
    
    const confirmDelete = window.confirm('Delete this task?');
    console.log('User confirmed:', confirmDelete);
    
    if (confirmDelete) {
      try {
        const result = await deleteTask(token, task._id);
        console.log('Delete result:', result);
        onRefresh();
        toast.success('Task deleted');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete');
      }
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Edit clicked');
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full mb-3 p-2 rounded-lg border focus:outline-none focus:ring-2"
          style={{ borderColor: '#E5E5E5' }}
          placeholder="Task title"
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full mb-3 p-2 rounded-lg border focus:outline-none focus:ring-2"
          style={{ borderColor: '#E5E5E5' }}
          rows="2"
          placeholder="Description..."
        />
        
        {/* Priority Selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-2" style={{ color: '#131214', opacity: 0.6 }}>
            Priority
          </label>
          <div className="flex gap-2">
            {['low', 'medium', 'high'].map((priority) => (
              <button
                key={priority}
                onClick={() => setEditPriority(priority)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize transition ${
                  editPriority === priority 
                    ? 'ring-2 ring-offset-1' 
                    : 'opacity-60'
                }`}
                style={{
                  backgroundColor: priorityConfig[priority].color,
                  ringColor: '#131214'
                }}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#131214', color: 'white' }}
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 rounded-lg text-sm border"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all relative"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start justify-between">
          <h4 className="font-medium flex-1 pr-2" style={{ color: '#131214' }}>
            {task.title}
          </h4>
        </div>
        
        {task.description && (
          <p className="text-xs mt-1" style={{ color: '#131214', opacity: 0.5 }}>
            {task.description}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{currentPriority.icon}</span>
          <span 
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: currentPriority.color, color: '#131214' }}
          >
            {currentPriority.text}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditClick}
            className="text-xs text-gray-400 hover:text-gray-600 transition"
            style={{ cursor: 'pointer' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-gray-400 hover:text-red-500 transition"
            style={{ cursor: 'pointer' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;