import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  description, 
  action, 
  className = "" 
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1">
          {subtitle && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200/50 rounded-full mb-4">
              <span className="text-sm font-medium text-blue-700">{subtitle}</span>
            </div>
          )}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </h2>
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
      {description && (
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
