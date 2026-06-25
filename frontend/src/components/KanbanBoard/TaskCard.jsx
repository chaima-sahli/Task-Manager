import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteTask } from "../../services/api";
import { getTagColor } from "../../utils/tagColors";
import toast from "react-hot-toast";
import DeleteConfirmModal from "../Dashboard/DeleteConfirmModal";
import EditTaskModal from "./EditTaskModal";

const TaskCard = ({ task, onRefresh, token, columnColor }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityConfig = {
    low: { text: "Low", icon: "♪", color: "#B6CAEC" },
    medium: { text: "Medium", icon: "♫", color: "#F6D76A" },
    high: { text: "High", icon: "♬", color: "#F7B7DA" },
  };

  const currentPriority = priorityConfig[task.priority] || priorityConfig.medium;

  const getDueDateBadge = () => {
    if (!task.dueDate) return null;

    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { label: "today", color: "#F6D76A", icon: "📌", textColor: "#131214" };
    }
    if (diffDays === 1) {
      return { label: "tomorrow", color: "#B6CAEC", icon: "📌", textColor: "#131214" };
    }
    if (diffDays < 0) {
      return { label: `${Math.abs(diffDays)}d overdue`, color: "#F7B7DA", icon: "⚠️", textColor: "#131214" };
    }
    if (diffDays <= 7) {
      return { label: `${diffDays}d`, color: "#E8F0FA", icon: "📅", textColor: "#131214" };
    }
    if (diffDays <= 30) {
      return { label: `${diffDays}d`, color: "#FAF4E3", icon: "📅", textColor: "#131214" };
    }
    const dueDateFormatted = dueDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return { label: dueDateFormatted, color: "#FDE8F3", icon: "📅", textColor: "#131214" };
  };

  const dueDateBadge = getDueDateBadge();

  const handleDelete = async () => {
    try {
      await deleteTask(token, task._id);
      onRefresh();
      toast.success("Task deleted");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditModal(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white rounded-xl p-4 transition-all relative group hover-lift float-up"
        style={{
          boxShadow: "3px 3px 0 0 #131214",
          border: "1.5px solid #131214",
        }}
      >
        {/* Drag handle area */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <div className="flex items-start justify-between">
            <h4 className="font-medium flex-1 pr-2" style={{ color: "#131214" }}>
              {task.title}
            </h4>
          </div>
          {task.description && (
            <p className="text-xs mt-1" style={{ color: "#131214", opacity: 0.5 }}>
              {task.description}
            </p>
          )}
        </div>

        {/* Tags display */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag) => {
              const color = getTagColor(tag);
              return (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: color.bg, color: color.text }}
                >
                  #{tag}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t" style={{ borderColor: "#E5E5E5" }}>
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Priority badge */}
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5"
              style={{ backgroundColor: currentPriority.color, color: "#131214" }}
            >
              {currentPriority.icon} {currentPriority.text}
            </span>

            {/* Due date badge */}
            {dueDateBadge && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5"
                style={{
                  backgroundColor: dueDateBadge.color,
                  color: dueDateBadge.textColor || "#131214",
                }}
              >
                {dueDateBadge.icon} {dueDateBadge.label}
              </span>
            )}
          </div>

          {/* Edit/Delete buttons */}
          <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
            <button
              onClick={handleEditClick}
              className="text-xs px-3 py-1 font-medium border-2 bg-transparent transition-all duration-200 hover:translate-x-0.5 hover:scale-105 hover:bg-[#B6CAEC] hover:shadow-[2px_2px_0_0_#131214] btn-squish"
              style={{ borderColor: "#131214", color: "#131214" }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ✎ Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-xs px-3 py-1 font-medium border-2 bg-transparent transition-all duration-200 hover:translate-x-0.5 hover:scale-105 hover:bg-[#F7B7DA] hover:shadow-[2px_2px_0_0_#131214] btn-squish"
              style={{ borderColor: "#131214", color: "#131214" }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ✕ delete
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={task}
        onRefresh={onRefresh}
        token={token}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        taskTitle={task.title}
      />
    </>
  );
};

export default TaskCard;