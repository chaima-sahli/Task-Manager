const QuickAddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className='fixed bottom-8 right-8 w-14 h-14 rounded-full
      border-2 shadow-[4px_4px_0_0_#131214] transition-all hover:translate-y-[-2px]
      hover:shadow-[6px_6px_0_0_#131214] flex items-center justify-center text-3xl 
      font-bold z-40 '
      style={{
        backgroundColor: "#F6D76A",
        borderColor: "#131214",
      }}
    >
      +
    </button>
  );
};

export default QuickAddButton;
