import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="animate-spin w-12 h-12 border-4 border-black"></div>
    </div>
  );
};

export default LoadingSpinner;
