import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'gray' | 'blue' | 'green' | 'amber' | 'red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export default function Chip({ 
  children, 
  variant = 'gray', 
  size = 'md',
  className = "",
  onClick 
}: ChipProps) {
  const baseClasses = "chip inline-flex items-center font-medium transition-colors";
  const variantClasses = {
    gray: "chip-gray",
    blue: "chip-blue", 
    green: "chip-green",
    amber: "chip-amber",
    red: "chip-red"
  };
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (onClick) {
    return (
      <button 
        type="button"
        className={classes}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  return (
    <span className={classes}>
      {children}
    </span>
  );
}
