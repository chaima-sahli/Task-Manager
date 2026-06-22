const KeyboardShortcuts = () => {
  return (
    <div className="fixed bottom-8 left-8 hidden lg:block">
      <div className="text-xs font-mono" style={{ color: "#131214", opacity: 0.25 }}>
        N new · ⌘F search · ESC close
      </div>
    </div>
  );
};

export default KeyboardShortcuts;