import React from 'react'

const Toast = ({ status, message, onClose }) => {
  const isSuccess = status >= 200 && status < 300;

  return (
    <div
      className={`relative w-96 rounded-lg bg-[#F3E4C9] border-l-4 shadow-lg p-4 ${
        isSuccess ? "border-green-600" : "border-red-600"
      }`}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
      >
        ✕
      </button>

      <h3
        className={`text-lg font-semibold ${
          isSuccess ? "text-green-700" : "text-red-700"
        }`}
      >
        {isSuccess ? "Success" : "Error"}
      </h3>

      <p className="mt-1 text-[#0A2947]">
        {message}
      </p>
    </div>
  );
};

export default Toast;