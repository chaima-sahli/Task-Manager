import { useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { useAuth } from "../../contexts/AuthContext";
import {
  updateTask,
  updateTaskPositions,
  createTask,
} from "../../services/api";
import Column from "./Column";
import toast from "react-hot-toast";

const KanbanBoard = ({ tasks, onTasksUpdate }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);

  const columns = [
    { id: "todo", title: "To Do", icon: "○", color: "#F7B7DA" },
    { id: "inprogress", title: "In Progress", icon: "◔", color: "#F6D76A" },
    { id: "done", title: "Done", icon: "✓", color: "#B6CAEC" },
  ];

  useEffect(() => {
    if (tasks && Array.isArray(tasks)) {
      setLoading(false);
    }
  }, [tasks]);

  const getTasksByStatus = (status) => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (event) => {
    console.log("Drag started:", event.active.id);
    const { active } = event;
    const task = tasks.find((t) => t._id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event) => {
    console.log("Drag ended:", event);
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      console.log("No drop target");
      return;
    }

    console.log("Over data:", over.data);
    console.log("Over current:", over.data?.current);
    console.log("Over id:", over.id);

    const activeTaskData = tasks.find((t) => t._id === active.id);
    if (!activeTaskData) {
      console.log("No active task data");
      return;
    }

    console.log("Active task:", activeTaskData);
    console.log("Active task status:", activeTaskData.status);

    let newStatus = activeTaskData.status;
    let newPosition = activeTaskData.position;

    // Check if dropping on a column
    if (over.data?.current?.type === "column") {
      newStatus = over.data.current.status;
      const columnTasks = getTasksByStatus(newStatus);
      newPosition = columnTasks.length;

      console.log(`Moving to column: ${newStatus}`);

      try {
        await updateTask(token, active.id, {
          status: newStatus,
          position: newPosition,
        });
        onTasksUpdate();
        toast.success(
          `Moved to ${columns.find((c) => c.id === newStatus)?.title}`,
        );
      } catch (error) {
        console.error("Failed to move task:", error);
        toast.error("Failed to move task");
      }
    }
    // Check if dropping on another task
    else if (over.data?.current?.type === "task") {
      const overTask = tasks.find((t) => t._id === over.id);
      if (overTask) {
        // If dropping on a task in a different column
        if (overTask.status !== activeTaskData.status) {
          newStatus = overTask.status;
          const columnTasks = getTasksByStatus(newStatus);
          newPosition = columnTasks.length;

          console.log(`Moving to column via task: ${newStatus}`);

          try {
            await updateTask(token, active.id, {
              status: newStatus,
              position: newPosition,
            });
            onTasksUpdate();
            toast.success(
              `Moved to ${columns.find((c) => c.id === newStatus)?.title}`,
            );
          } catch (error) {
            console.error("Failed to move task:", error);
            toast.error("Failed to move task");
          }
        }
        // Same column - reorder
        else {
          const columnTasks = getTasksByStatus(activeTaskData.status);
          const oldIndex = columnTasks.findIndex((t) => t._id === active.id);
          const newIndex = columnTasks.findIndex((t) => t._id === over.id);

          console.log(
            `Reordering within column from ${oldIndex} to ${newIndex}`,
          );

          const updatedTasks = [...columnTasks];
          const [movedTask] = updatedTasks.splice(oldIndex, 1);
          updatedTasks.splice(newIndex, 0, movedTask);

          const updates = updatedTasks.map((task, idx) => ({
            id: task._id,
            status: activeTaskData.status,
            position: idx,
          }));

          try {
            await updateTaskPositions(token, updates);
            onTasksUpdate();
            toast.success("Task reordered");
          } catch (error) {
            console.error("Failed to reorder task:", error);
            toast.error("Failed to reorder task");
          }
        }
      }
    }
  };

  const handleCreateTask = async (status) => {
    const newTask = {
      title: "new task",
      description: "click to edit",
      status: status,
      priority: "medium",
      dueDate: null
    };

    try {
      await createTask(token, newTask);
      onTasksUpdate();
      toast.success("Task created");
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <div className='text-2xl animate-pulse' style={{ color: "#131214" }}>
          loading...
        </div>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch'>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.id)}
            onCreateTask={() => handleCreateTask(column.id)}
            onRefresh={onTasksUpdate}
            token={token}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div
            className='bg-white rounded-xl p-4 opacity-90'
            style={{
              boxShadow: "3px 3px 0 0 #131214",
              border: "1.5px solid #131214",
            }}
          >
            <h4 className='font-medium'>{activeTask.title}</h4>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
