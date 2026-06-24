import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateTask, deleteTask } from "../../services/api";
import toast from "react-hot-toast";
import DeleteConfirmModal from "../Dashboard/DeleteConfirmModal";
import { getTagColor, SUGGESTED_TAGS } from "../../utils/tagColors";

const TaskCard = ({ task, onRefresh, token, columnColor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || "",
  );
  const [editPriority, setEditPriority] = useState(task.priority || "medium");
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
  );

  const [editTags, setEditTags] = useState(task.tags || []);
  const [tagInput, setTagInput] = useState("");

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

  const currentPriority =
    priorityConfig[task.priority] || priorityConfig.medium;

  // 🆕 Due date badge logic
  const getDueDateBadge = () => {
    if (!task.dueDate) return null;

    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Today
    if (diffDays === 0) {
      return {
        label: "today",
        color: "#F6D76A",
        icon: "📌",
        textColor: "#131214",
      };
    }
    // Tomorrow
    if (diffDays === 1) {
      return {
        label: "tomorrow",
        color: "#B6CAEC",
        icon: "📌",
        textColor: "#131214",
      };
    }
    // Overdue
    if (diffDays < 0) {
      return {
        label: `${Math.abs(diffDays)}d overdue`,
        color: "#F7B7DA",
        icon: "⚠️",
        textColor: "#131214",
      };
    }
    // Upcoming (2-7 days)
    if (diffDays <= 7) {
      return {
        label: `${diffDays}d`,
        color: "#E8F0FA",
        icon: "📅",
        textColor: "#131214",
      };
    }
    // Future (more than 7 days)
    if (diffDays <= 30) {
      return {
        label: `${diffDays}d`,
        color: "#FAF4E3",
        icon: "📅",
        textColor: "#131214",
      };
    }
    // Far future
    const dueDateFormatted = dueDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return {
      label: dueDateFormatted,
      color: "#FDE8F3",
      icon: "📅",
      textColor: "#131214",
    };
  };

  const dueDateBadge = getDueDateBadge();

  const handleAddTag = () => {
    if (tagInput.trim() && !editTags.includes(tagInput.trim())) {
      setEditTags([...editTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove));
  };

  const handleUpdate = async () => {
    try {
      await updateTask(token, task._id, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        dueDate: editDueDate || null,
        tags: editTags,
      });
      setIsEditing(false);
      onRefresh();
      toast.success("Task updated");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

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
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div
        className='bg-white rounded-xl p-4'
        style={{
          boxShadow: "3px 3px 0 0 #131214",
          border: "1.5px solid #131214",
        }}
      >
        <input
          type='text'
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className='w-full mb-3 p-2 rounded-lg border focus:outline-none focus:ring-2'
          style={{ borderColor: "#E5E5E5" }}
          placeholder='Task title'
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className='w-full mb-3 p-2 rounded-lg border focus:outline-none focus:ring-2'
          style={{ borderColor: "#E5E5E5" }}
          rows='2'
          placeholder='Description...'
        />

        <div className='mb-4'>
          <label
            className='block text-xs font-medium mb-2'
            style={{ color: "#131214", opacity: 0.6 }}
          >
            Priority
          </label>
          <div className='flex gap-2'>
            {["low", "medium", "high"].map((priority) => (
              <button
                key={priority}
                onClick={() => setEditPriority(priority)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize transition ${
                  editPriority === priority
                    ? "ring-2 ring-offset-1"
                    : "opacity-60"
                }`}
                style={{
                  backgroundColor: priorityConfig[priority].color,
                  ringColor: "#131214",
                }}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/*  Due date picker in edit mode */}
        <div className='mb-4'>
          <label
            className='block text-xs font-medium mb-2'
            style={{ color: "#131214", opacity: 0.6 }}
          >
            Due Date
          </label>
          <input
            type='date'
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className='w-full p-2 border-2 bg-white'
            style={{ borderColor: "#131214" }}
          />
        </div>

        {/* 🆕 Tags Section - Custom Selector */}
        <div className='mb-4'>
          <label
            className='block text-xs font-medium mb-2'
            style={{ color: "#131214", opacity: 0.6 }}
          >
            Tags
          </label>

          <div className='flex flex-wrap gap-2 mb-2'>
            {SUGGESTED_TAGS.map((suggestedTag) => {
              const color = getTagColor(suggestedTag);
              const isSelected = editTags.includes(suggestedTag);
              return (
                <button
                  key={suggestedTag}
                  onClick={() => {
                    if (isSelected) {
                      setEditTags(editTags.filter((t) => t !== suggestedTag));
                    } else {
                      setEditTags([...editTags, suggestedTag]);
                    }
                  }}
                  className={`text-xs px-3 py-1 rounded-full border-2 transition-all hover:scale-105 ${
                    isSelected ? "opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                  style={{
                    backgroundColor: isSelected ? color.bg : "transparent",
                    borderColor: "#131214",
                    color: isSelected ? color.text : "#131214",
                  }}
                >
                  #{suggestedTag}
                </button>
              );
            })}
          </div>

          {/* Or add custom tag */}
          <div className='flex gap-2'>
            <input
              type='text'
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder='or type your own...'
              className='flex-1 p-2 border-2 bg-white text-sm'
              style={{ borderColor: "#131214" }}
            />
            <button
              onClick={handleAddTag}
              className='px-3 py-1 border-2 text-sm transition-all hover:translate-x-0.5'
              style={{ borderColor: "#131214", backgroundColor: "#B6CAEC" }}
            >
              Add
            </button>
          </div>

          {/* Selected tags display */}
          <div className='flex flex-wrap gap-1.5 mt-3'>
            {editTags.map((tag) => {
              const color = getTagColor(tag);
              return (
                <span
                  key={tag}
                  className='text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium'
                  style={{ backgroundColor: color.bg, color: color.text }}
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className='hover:opacity-70 text-xs'
                    style={{ color: color.text }}
                  >
                    ✕
                  </button>
                </span>
              );
            })}
            {editTags.length === 0 && (
              <span
                className='text-xs'
                style={{ color: "#131214", opacity: 0.3 }}
              >
                No tags yet
              </span>
            )}
          </div>
        </div>

        <div className='flex gap-2'>
          <button
            onClick={handleUpdate}
            className='px-4 py-2 border-2 font-medium transition-all hover:translate-x-0.5'
            style={{
              borderColor: "#131214",
              backgroundColor: "#F6D76A",
              color: "#131214",
            }}
          >
            ✓ save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className='px-4 py-2 border-2 font-medium transition-all hover:translate-x-0.5'
            style={{
              borderColor: "#131214",
              backgroundColor: "#FAF4E3",
              color: "#131214",
            }}
          >
            ✕ cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className='bg-white rounded-xl p-4 transition-all relative group'
        style={{
          boxShadow: "3px 3px 0 0 #131214",
          border: "1.5px solid #131214",
        }}
      >
        {/* Drag handle area */}
        <div
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing'
        >
          <div className='flex items-start justify-between'>
            <h4
              className='font-medium flex-1 pr-2'
              style={{ color: "#131214" }}
            >
              {task.title}
            </h4>
          </div>

          {task.description && (
            <p
              className='text-xs mt-1'
              style={{ color: "#131214", opacity: 0.5 }}
            >
              {task.description}
            </p>
          )}
        </div>

        {/*  Tags display */}
        {task.tags && task.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-2'>
            {task.tags.map((tag) => {
              const color = getTagColor(tag);
              return (
                <span
                  key={tag}
                  className='text-[10px] px-2 py-0.5 rounded-full font-medium'
                  style={{ backgroundColor: color.bg, color: color.text }}
                >
                  #{tag}
                </span>
              );
            })}
          </div>
        )}

        <div
          className='flex items-center justify-between mt-3 pt-2 border-t'
          style={{ borderColor: "#E5E5E5" }}
        >
          <div className='flex items-center gap-1.5 flex-wrap'>
            {/* Priority badge */}
            <span
              className='text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5'
              style={{
                backgroundColor: currentPriority.color,
                color: "#131214",
              }}
            >
              {currentPriority.icon} {currentPriority.text}
            </span>

            {/* 🆕 Due date badge */}
            {dueDateBadge && (
              <span
                className='text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5'
                style={{
                  backgroundColor: dueDateBadge.color,
                  color: dueDateBadge.textColor || "#131214",
                }}
              >
                {dueDateBadge.icon} {dueDateBadge.label}
              </span>
            )}
          </div>
          <div className='flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity'>
            <button
              onClick={handleEditClick}
              className='text-xs px-3 py-1 font-medium border-2 bg-transparent transition-all duration-200 hover:translate-x-0.5 hover:scale-105 hover:bg-[#B6CAEC] hover:shadow-[2px_2px_0_0_#131214]'
              style={{
                borderColor: "#131214",
                color: "#131214",
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ✎ Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className='text-xs px-3 py-1 font-medium border-2 bg-transparent transition-all duration-200 hover:translate-x-0.5 hover:scale-105 hover:bg-[#F7B7DA] hover:shadow-[2px_2px_0_0_#131214]'
              style={{
                borderColor: "#131214",
                color: "#131214",
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ✕ delete
            </button>
          </div>
        </div>
      </div>

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
