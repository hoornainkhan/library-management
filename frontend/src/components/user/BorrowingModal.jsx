import React, { useState } from "react";
import { returnBook } from '../../services/borrowingApi';
import Toast from '../Toast';

const BorrowingModal = ({ book, onClose }) => {
  const [returning, setReturning] = useState(false);
  const [toast, setToast] = useState(null);

  const handleReturn = async () => {
    setReturning(true);
    try {
      const result = await returnBook(book._id);
      setToast({
        status: 200,
        message: `Successfully returned "${book.title}"!`
      });
      
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (error) {
      setToast({
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Failed to return book'
      });
    } finally {
      setReturning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      {toast && (
        <div className="fixed top-5 right-5 z-50">
          <Toast
            status={toast.status}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className="w-[500px] rounded-2xl bg-[#F3E4C9] shadow-2xl p-8">
        {/* Cover */}
        <div className="flex justify-center">
          <img
            src={book.cover}
            alt={book.title}
            className="w-40 h-60 object-cover rounded-xl shadow-lg"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150x200?text=No+Cover';
            }}
          />
        </div>

        {/* Title */}
        <div className="text-center mt-6">
          <h2 className="text-3xl font-bold text-[#0A2947]">
            {book.title}
          </h2>
          <h3 className="text-xl font-semibold text-[#8B5E3C] mt-2">
            {book.author}
          </h3>
        </div>

        {/* Dates */}
        <div className="flex justify-between mt-8">
          <div>
            <p className="font-semibold">Borrow Date</p>
            <p>{book.borrowDate}</p>
          </div>
          <div>
            <p className="font-semibold">Due Date</p>
            <p>{book.dueDate}</p>
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-8 text-center">
          <p className="font-semibold">
            {book.remainingDays >= 0 ? "Days Remaining" : "Overdue By"}
          </p>
          <p
            className={`text-2xl font-bold mt-2 ${
              book.remainingDays > 5
                ? "text-green-700"
                : book.remainingDays > 0
                ? "text-orange-500"
                : "text-red-600"
            }`}
          >
            {book.remainingDays >= 0
              ? `${book.remainingDays} Days`
              : `${Math.abs(book.remainingDays)} Days`}
          </p>
        </div>

        {/* Fine */}
        {book.fine > 0 && (
          <div className="mt-6 text-center">
            <p className="font-semibold text-red-600">Fine to Pay</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              ₹ {book.fine}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-10">
          <button
            onClick={onClose}
            className="px-8 py-2 rounded-lg border border-[#8B5E3C] hover:bg-[#B3D4C0] transition"
            disabled={returning}
          >
            Cancel
          </button>
          <button
            onClick={handleReturn}
            disabled={returning}
            className="px-8 py-2 rounded-lg bg-[#8B5E3C] text-white hover:bg-[#714a2d] transition disabled:opacity-50"
          >
            {returning ? 'Returning...' : 'Return Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowingModal;