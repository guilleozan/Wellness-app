export const Button = ({ 
  children, 
  variant = "default", 
  className = "", 
  onClick,
  ...props 
}) => {
  const variants = {
    default: "bg-blue-500 hover:bg-blue-600 text-white",
    outline: "border border-gray-300 hover:bg-gray-100 text-gray-700",
    destructive: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      className={`
        px-4 
        py-2 
        rounded-md 
        font-medium 
        transition-colors 
        duration-200 
        flex 
        items-center 
        justify-center 
        disabled:opacity-50 
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};