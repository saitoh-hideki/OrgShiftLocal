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
    <div className={`section-header ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-center flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="subtitle text-lg font-normal text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
      {description && (
        <p className="description text-lg text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
