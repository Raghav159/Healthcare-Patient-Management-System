import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullPage?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  message = 'Loading...',
  fullPage = false,
}) => {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`loading loading-spinner text-primary ${sizeClass[size]}`}></div>
      {message && <p className="mt-2 text-gray-600">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loading;