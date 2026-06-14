import { useState, useEffect } from 'react';
import { DndContext, closestCorners, DragOverlay, pointerWithin } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, updateTask, updateTaskPositions, createTask, deleteTask } from '../services/api';
import TaskCard from './TaskCard';
import Column from './Column';
import toast from 'react-hot-toast';

const KanbanBoard = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);

  const columns = [
    { id: 'todo', title: 'to do', icon: '○', color: '#F7B7DA' },
    { id: 'inprogress', title: 'in progress', icon: '→', color: '#F6D76A' },
    { id: 'done', title: 'done', icon: '✓', color: '#B6CAEC' }
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks(token);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status).sort((a, b) => a.position - b.position);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskData = tasks.find(t => t._id === active.id);
    if (!activeTaskData) return;

    let newStatus = activeTaskData.status;
    let newPosition = activeTaskData.position;

    // Check if dropping on a column
    if (over.data?.current?.type === 'column') {
      newStatus = over.data.current.status;
      const columnTasks = getTasksByStatus(newStatus);
      newPosition = columnTasks.length;
      
      await updateTask(token, active.id, { 
        status: newStatus, 
        position: newPosition 
      });
      fetchTasks();
      toast.success(`Moved to ${columns.find(c => c.id === newStatus)?.title}`);
    }
    // Check if dropping on another task
    else if (over.data?.current?.type === 'task') {
      const overTask = tasks.find(t => t._id === over.id);
      if (overTask && overTask.status === activeTaskData.status) {
        // Reorder within same column
        const columnTasks = getTasksByStatus(activeTaskData.status);
        const oldIndex = columnTasks.findIndex(t => t._id === active.id);
        const newIndex = columnTasks.findIndex(t => t._id === over.id);
        
        const updatedTasks = [...columnTasks];
        const [movedTask] = updatedTasks.splice(oldIndex, 1);
        updatedTasks.splice(newIndex, 0, movedTask);
        
        const updates = updatedTasks.map((task, idx) => ({
          id: task._id,
          status: activeTaskData.status,
          position: idx
        }));
        
        await updateTaskPositions(token, updates);
        fetchTasks();
      }
    }
  };

  const handleCreateTask = async (status) => {
    const newTask = {
      title: 'new task',
      description: 'click to edit',
      status: status,
      priority: 'medium'
    };
    
    try {
      await createTask(token, newTask);
      fetchTasks();
      toast.success('Task created');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-2xl animate-pulse" style={{ color: '#131214' }}>loading...</div>
      </div>
    );
  }

  return (
    <DndContext 
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <Column
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.id)}
            onCreateTask={() => handleCreateTask(column.id)}
            onRefresh={fetchTasks}
            token={token}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="bg-white rounded-xl shadow-lg p-4 opacity-90">
            <h4 className="font-medium">{activeTask.title}</h4>
            {activeTask.description && (
              <p className="text-xs mt-1 opacity-60">{activeTask.description}</p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;