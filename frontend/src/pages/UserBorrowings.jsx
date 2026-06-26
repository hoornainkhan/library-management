import React, { useState, useEffect } from "react";
import UserNavbar from "../components/user/UserNavbar";
import BorrowingModal from "../components/user/BorrowingModal";
import { getMyBorrowings } from '../services/borrowingApi';
import { getCurrentUser } from '../services/authApi';
import Toast from '../components/Toast';

const UserBorrowings = () => {
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        setLoading(true);
        const data = await getMyBorrowings();
        setBorrowings(data.active || []);
      } catch (error) {
        console.error('Error fetching borrowings:', error);
        setToast({
          status: error.response?.status || 500,
          message: error.response?.data?.message || 'Failed to fetch borrowings'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBorrowings();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateRemainingDays = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateFine = (dueDate) => {
    const remaining = calculateRemainingDays(dueDate);
    if (remaining < 0) {
      return Math.abs(remaining) * 5;
    }
    return 0;
  };

  const filteredBooks = borrowings.filter((borrowing) => {
    const query = search.toLowerCase();
    const title = borrowing.bookId?.title || '';
    const author = borrowing.bookId?.author || '';
    return title.toLowerCase().includes(query) || 
           author.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <>
        <UserNavbar username={user?.username || 'User'} currentPage="borrowings" />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading your borrowings...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar username={user?.username || 'User'} currentPage="borrowings" />
      
      {toast && (
        <div className="fixed top-5 right-5 z-50">
          <Toast
            status={toast.status}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className="px-10 pb-10">
        {/* Heading */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-[#0A2947]">
            Borrowings of {user?.username || 'User'}
          </h1>
          <input
            type="text"
            placeholder="Search borrowed books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 rounded-lg border border-[#AACCB6] bg-[#fbf5ef] px-4 py-2 outline-none focus:border-[#8B5E3C]"
          />
        </div>

        {/* Books */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-5 gap-8">
            {filteredBooks.map((borrowing) => {
              const remainingDays = calculateRemainingDays(borrowing.dueDate);
              const fine = calculateFine(borrowing.dueDate);
              
              return (
                <button
                  key={borrowing._id}
                  onClick={() => setSelectedBook({
                    ...borrowing,
                    remainingDays,
                    fine,
                    borrowDate: formatDate(borrowing.borrowDate),
                    dueDate: formatDate(borrowing.dueDate),
                    cover: borrowing.bookId?.coverImage || 'https://via.placeholder.com/150x200?text=No+Cover',
                    title: borrowing.bookId?.title || 'Unknown Book',
                    author: borrowing.bookId?.author || 'Unknown Author'
                  })}
                  className="flex flex-col items-center hover:scale-105 transition duration-300"
                >
                  <img
                    src={borrowing.bookId?.coverImage || 'https://via.placeholder.com/150x200?text=No+Cover'}
                    alt={borrowing.bookId?.title || 'Book'}
                    className="w-40 h-60 rounded-xl object-cover shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x200?text=No+Cover';
                    }}
                  />
                  <h3 className="mt-3 w-40 truncate text-center font-medium text-[#0A2947]">
                    {borrowing.bookId?.title || 'Unknown Book'}
                  </h3>
                  {remainingDays < 0 && (
                    <p className="text-red-600 text-sm font-semibold">
                      Overdue by {Math.abs(remainingDays)} days
                    </p>
                  )}
                  {remainingDays >= 0 && (
                    <p className="text-green-600 text-sm">
                      {remainingDays} days remaining
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No active borrowings</p>
            <p className="mt-2">Browse books and start reading!</p>
          </div>
        )}
      </div>

      {selectedBook && (
        <BorrowingModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </>
  );
};

export default UserBorrowings;