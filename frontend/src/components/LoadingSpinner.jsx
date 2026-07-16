import React from 'react';
import './LoadingSpinner.css';
// LoadingSpinner component to indicate loading state
const LoadingSpinner = () => {
  return (
    <div className="spinner-center">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
