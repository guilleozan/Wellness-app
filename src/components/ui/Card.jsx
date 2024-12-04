export const Card = ({ className = "", children, ...props }) => (
  <div
    className={`
      bg-white 
      rounded-lg 
      shadow-md 
      border 
      border-gray-200
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className = "", children, ...props }) => (
  <div
    className={`
      px-6 
      py-4 
      border-b 
      border-gray-200
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ className = "", children, ...props }) => (
  <h3
    className={`
      text-xl 
      font-semibold 
      text-gray-900
      ${className}
    `}
    {...props}
  >
    {children}
  </h3>
);

export const CardContent = ({ className = "", children, ...props }) => (
  <div
    className={`
      p-6
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);