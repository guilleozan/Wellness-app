import React from "react";

const Switch = React.forwardRef(({ className = "", checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      ref={ref}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
        focus:ring-ring focus:ring-offset-2 focus:ring-offset-background 
        ${checked ? 'bg-primary' : 'bg-input'} ${className}
      `}
      {...props}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg 
          ring-0 transition duration-200 ease-in-out 
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
});

Switch.displayName = "Switch";

export { Switch };