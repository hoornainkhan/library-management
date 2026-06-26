import React from 'react'

const ToastContainer = ({ children }) => {
  return (
    <div className="fixed top-5 right-5 z-50 space-y-4">
      {children}
    </div>
  );
};

export default ToastContainer;