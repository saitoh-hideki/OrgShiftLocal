import React from 'react';

interface CardBaseProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  as?: 'div' | 'button' | 'a';
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export default function CardBase({ 
  children, 
  className = "", 
  onClick,
  href,
  as = 'div',
  variant = 'default',
  size = 'md',
  hover = true
}: CardBaseProps) {
  // ベースクラス
  const baseClasses = "relative overflow-hidden transition-all duration-200 ease-out";
  
  // サイズ別パディング
  const sizeClasses = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8"
  };
  
  // バリアント別スタイル
  const variantClasses = {
    default: "bg-white border border-gray-100 shadow-sm hover:shadow-md",
    elevated: "bg-white border border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-0.5",
    outlined: "bg-white border-2 border-gray-200 shadow-none hover:border-gray-300",
    ghost: "bg-gray-50/50 border border-transparent hover:bg-gray-100/80"
  };
  
  // ホバーエフェクト
  const hoverClasses = hover ? "hover:shadow-md hover:-translate-y-0.5" : "";
  
  // アクティブ状態
  const activeClasses = "active:scale-[0.98] active:shadow-sm";
  
  const classes = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    hoverClasses,
    activeClasses,
    "rounded-2xl", // 角丸16px
    className
  ].filter(Boolean).join(" ");
  
  if (as === 'button' || onClick) {
    return (
      <button 
        type="button"
        className={`${classes} w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2`}
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
        className={`${classes} block cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2`}
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
