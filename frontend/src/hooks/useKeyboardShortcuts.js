import { useEffect } from 'react';

export const useKeyboardShortcuts = ({
  searchTerm,
  showQuickAdd,
  setSearchTerm,
  setShowQuickAdd,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";

      // Ctrl+F or Cmd+F - Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
        return;
      }

      // Escape - Close modal first, then clear search
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();

        if (showQuickAdd) {
          setShowQuickAdd(false);
          return;
        }

        if (searchTerm) {
          setSearchTerm("");
          return;
        }

        if (document.activeElement) {
          document.activeElement.blur();
        }
        return;
      }

      // Backspace - Close modal if input is empty
      if (e.key === "Backspace" && showQuickAdd) {
        const input = document.getElementById("quickTaskTitle");
        if (input && input.value === "") {
          e.preventDefault();
          setShowQuickAdd(false);
        }
      }

      // 'n' key alone - Quick add
      if (e.key === "n" && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        if (!isInput) {
          e.preventDefault();
          setShowQuickAdd(true);
          setTimeout(() => {
            document.getElementById("quickTaskTitle")?.focus();
          }, 100);
        }
      }

      // Ctrl+Shift+N - Fallback quick add
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "n") {
        e.preventDefault();
        e.stopPropagation();
        setShowQuickAdd(true);
        setTimeout(() => {
          document.getElementById("quickTaskTitle")?.focus();
        }, 100);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [searchTerm, showQuickAdd, setSearchTerm, setShowQuickAdd]);
};