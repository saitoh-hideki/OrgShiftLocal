import React from 'react';

interface CardBaseProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  as?: 'div' | 'button' | 'a';
}

export default function CardBase({ 
  children, 
  className = "", 
  onClick,
  href,
  as = 'div'
}: CardBaseProps) {
  const baseClasses = "card-base p-6";
  const classes = `${baseClasses} ${className}`;
  
  if (as === 'button' || onClick) {
    return (
      <button 
        type="button"
        className={`${classes} w-full text-left cursor-pointer`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  
  if (as === 'a' || href) {
    return (
      <a 
        href={href}
        className={`${classes} block cursor-pointer`}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
}
