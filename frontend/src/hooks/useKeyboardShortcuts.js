import { useEffect } from 'react';

export const useKeyboardShortcuts = ({
  searchTerm,
  showQuickAdd,
  showCalendar,
  showAnalytics,
  showShortcuts,
  setSearchTerm,
  setShowQuickAdd,
  setShowCalendar,
  setShowShortcuts,
  setShowAnalytics
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

      // Ctrl+C or Cmd+C - Open Calendar (only if not in input)
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        if (!isInput && setShowCalendar) {
          e.preventDefault();
          e.stopPropagation();
          setShowCalendar(true);
        }
        return;
      }

      // Escape - Close modals first, then clear search
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();

        // Close shortcuts modal
        if (showShortcuts && setShowShortcuts) {
          setShowShortcuts(false);
          return;
        }

        // Close calendar
        if (showCalendar && setShowCalendar) {
          setShowCalendar(false);
          return;
        }
        // Close analytics
        if (showAnalytics && setShowAnalytics) {
          setShowAnalytics(false);
          return;
        }

        // Close quick add
        if (showQuickAdd && setShowQuickAdd) {
          setShowQuickAdd(false);
          return;
        }

        // Clear search
        if (searchTerm) {
          setSearchTerm("");
          return;
        }

        // Blur active element
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

      // 'n' key alone - Quick add (only if not in input)
      if (e.key === "n" && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        if (!isInput) {
          e.preventDefault();
          e.stopPropagation();
          setShowQuickAdd(true);
          setTimeout(() => {
            document.getElementById("quickTaskTitle")?.focus();
          }, 100);
        }
      }

      // 'n' key alone - Quick add (only if not in input)
      if (e.key === "a" && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        if (!isInput) {
          e.preventDefault();
          e.stopPropagation();
          setShowAnalytics(true);
        }
        return;
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
  }, [searchTerm, showQuickAdd, showCalendar, showAnalytics, showShortcuts, setSearchTerm, setShowQuickAdd, setShowCalendar, setShowShortcuts, setShowAnalytics]);
};