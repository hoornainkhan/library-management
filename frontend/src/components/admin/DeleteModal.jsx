import React from "react";

const DeleteModal = ({ book, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-105 rounded-2xl bg-[#F3E4C9] p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-[#0A2947] mb-4">
          Delete Book
        </h2>
        <p className="text-[#0A2947] leading-7">
          Are you sure you want to delete
          <span className="font-semibold text-[#8B5E3C]">
            {" "}{book?.title}
          </span>
          ?
        </p>
        <p className="mt-2 text-sm text-gray-600">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-[#8B5E3C] hover:bg-[#B3D4C0] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;