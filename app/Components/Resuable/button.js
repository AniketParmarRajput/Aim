import React from 'react';

const DynamicButton = ({ children, className, onClick }) => {
  return (
    <button 
      className={`px-4 py-2 rounded-lg text-red-400 ${className}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default DynamicButton;

