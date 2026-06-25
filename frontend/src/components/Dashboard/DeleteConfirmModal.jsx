import { useEffect, useRef } from "react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
   const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpenRef.current) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 border-2 max-w-sm w-full mx-4"
        style={{ borderColor: '#131214' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold" style={{ color: '#131214' }}>
            ⚠️ Delete Task
          </h3>
          <button
            onClick={onClose}
            className="text-xl font-mono hover:opacity-100 transition"
            style={{ color: '#131214', opacity: 0.4 }}
          >
            ✕
          </button>
        </div>

        <p className="mb-6" style={{ color: '#131214' }}>
          Are you sure you want to delete <strong>"{taskTitle}"</strong>?
          <br />
          <span className="text-sm" style={{ opacity: 0.5 }}>
            This action cannot be undone.
          </span>
        </p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 transition-all hover:translate-x-0.5"
            style={{ borderColor: '#131214' }}
          >
            cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border-2 font-medium transition-all hover:translate-x-0.5"
            style={{
              borderColor: '#131214',
              backgroundColor: '#F7B7DA',
              color: '#131214',
            }}
          >
            ✓ confirm delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;