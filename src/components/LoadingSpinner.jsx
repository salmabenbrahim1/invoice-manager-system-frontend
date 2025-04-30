import React, { useState, useEffect } from 'react';

const LoadingSpinner = ({ 
  size = 'md',
  color = 'primary',
  className = '', 
  overlay = true,
  blur = true,
  position = 'fixed',
  fullScreen = true,
  text = '',
  speed = 'normal'
}) => {
  const [dots, setDots] = useState('');
  
  // Animate the dots
  useEffect(() => {
    if (!text) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500); // Adjust speed as needed
    
    return () => clearInterval(interval);
  }, [text]);

  // Size mapping
  const sizeClasses = {
    sm: 'h-8 w-8 border-t-2',
    md: 'h-12 w-12 border-t-3',
    lg: 'h-16 w-16 border-t-4',
    xl: 'h-20 w-20 border-t-5'
  };

  // Color mapping
  const colorClasses = {
    primary: 'border-purple-600',
    secondary: 'border-gray-600',
    success: 'border-green-600',
    danger: 'border-red-600',
    warning: 'border-yellow-600',
    info: 'border-blue-600'
  };

  // Speed mapping
  const speedClasses = {
    slow: 'animate-[spin_1.5s_linear_infinite]',
    normal: 'animate-[spin_1s_linear_infinite]',
    fast: 'animate-[spin_0.5s_linear_infinite]'
  };

  // Overlay container classes
  const containerClasses = [
    position,
    fullScreen ? 'inset-0' : '',
    overlay ? 'bg-white/60' : '',
    blur ? 'backdrop-blur-sm' : '',
    'flex items-center justify-center z-30',
    className
  ].filter(Boolean).join(' ');

  // Spinner classes
  const spinnerClasses = [
    'animate-spin rounded-full',
    sizeClasses[size] || sizeClasses.md,
    colorClasses[color] || colorClasses.primary,
    speedClasses[speed] || speedClasses.normal,
    'border-solid'
  ].join(' ');

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <div className={spinnerClasses}></div>
        {text && (
          <span className="text-sm font-medium text-gray-700">
            {text}{dots}
            {/* Invisible dots to maintain consistent width */}
            <span className="invisible">...</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;