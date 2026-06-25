import { useState, useEffect, useRef } from "react";
import { updateTask } from "../../services/api";
import { getTagColor, SUGGESTED_TAGS } from "../../utils/tagColors";
import toast from "react-hot-toast";

const EditTaskModal = ({ isOpen, onClose, task, onRefresh, token }) => {
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

  // Use a ref to track if modal is open
  const isOpenRef = useRef(isOpen);

  // Update ref when isOpen changes
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if modal is open and ESC is pressed
      if (e.key === "Escape" && isOpenRef.current) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Disable body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      console.log("Event listener removed"); // Debug log
    };
  }, [onClose]);

  const priorityConfig = {
    low: { text: "Low", icon: "♪", color: "#B6CAEC" },
    medium: { text: "Medium", icon: "♫", color: "#F6D76A" },
    high: { text: "High", icon: "♬", color: "#F7B7DA" },
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editTags.includes(tagInput.trim())) {
      setEditTags([...editTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    try {
      await updateTask(token, task._id, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        dueDate: editDueDate || null,
        tags: editTags,
      });
      onRefresh();
      onClose();
      toast.success("Task updated! ✨");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'
      onClick={onClose}
    >
      <div
        className='bg-white border-2 w-full max-w-lg max-h-[100vh] overflow-y-auto'
        style={{ borderColor: "#131214" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className='p-4 border-b-2 flex items-center justify-between'
          style={{ borderColor: "#131214" }}
        >
          <h3 className='text-lg font-bold' style={{ color: "#131214" }}>
            ✎ Edit Task
          </h3>
          <button
            onClick={onClose}
            className='text-xl font-mono hover:opacity-100 transition'
            style={{ color: "#131214", opacity: 0.4 }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className='p-4 space-y-4'>
          {/* Title */}
          <div>
            <label
              className='block text-xs font-medium mb-1'
              style={{ color: "#131214", opacity: 0.6 }}
            >
              Title
            </label>
            <input
              type='text'
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className='w-full p-2 border-2 bg-white'
              style={{ borderColor: "#131214" }}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label
              className='block text-xs font-medium mb-1'
              style={{ color: "#131214", opacity: 0.6 }}
            >
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className='w-full p-2 border-2 bg-white resize-none'
              style={{ borderColor: "#131214" }}
              rows='3'
            />
          </div>

          {/* Priority */}
          <div>
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
                  className={`px-4 py-2 border-2 text-sm capitalize transition-all ${
                    editPriority === priority
                      ? "scale-105"
                      : "opacity-50 hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: priorityConfig[priority].color,
                    borderColor: "#131214",
                    color: "#131214",
                  }}
                >
                  {priorityConfig[priority].icon} {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label
              className='block text-xs font-medium mb-1'
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

          {/* Tags */}
          <div>
            <label
              className='block text-xs font-medium mb-2'
              style={{ color: "#131214", opacity: 0.6 }}
            >
              Tags
            </label>

            {/* Suggested Tags */}
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

            {/* Custom Tag Input */}
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
                placeholder='Type a custom tag...'
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

            {/* Selected Tags */}
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
        </div>

        {/* Modal Footer */}
        <div
          className='p-4 border-t-2 flex gap-2 justify-end'
          style={{ borderColor: "#131214" }}
        >
          <button
            onClick={onClose}
            className='px-4 py-2 border-2 transition-all hover:translate-x-0.5'
            style={{ borderColor: "#131214", backgroundColor: "#FAF4E3" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className='px-4 py-2 border-2 font-medium transition-all hover:translate-x-0.5'
            style={{ borderColor: "#131214", backgroundColor: "#F6D76A" }}
          >
            ✓ Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
