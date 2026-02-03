
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-light-card/60 dark:bg-dark-card/60 
        backdrop-blur-xl 
        border border-white/10 dark:border-white/5
        rounded-2xl shadow-lg
        p-6
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};
