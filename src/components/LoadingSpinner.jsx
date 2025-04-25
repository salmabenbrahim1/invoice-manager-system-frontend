import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };

  // Color classes
  const colorClasses = {
    primary: 'border-t-purple-600 border-b-purple-600',
    secondary: 'border-t-gray-600 border-b-gray-600',
    white: 'border-t-white border-b-white',
    danger: 'border-t-red-600 border-b-red-600',
    success: 'border-t-green-600 border-b-green-600'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} border-transparent`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;