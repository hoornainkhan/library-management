import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import UserNavbar from "../components/user/UserNavbar";
import { getBookById } from '../services/bookApi';
import { borrowBook } from '../services/borrowingApi';
import { getCurrentUser } from '../services/authApi';
import Toast from '../components/Toast';

const UserBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [toast, setToast] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await getBookById(id);
        setBook(data);
      } catch (error) {
        console.error('Error fetching book:', error);
        setToast({
          status: 404,
          message: 'Book not found'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    if (!user) {
      setToast({
        status: 401,
        message: 'Please login to borrow books'
      });
      return;
    }

    setBorrowing(true);
    try {
      const result = await borrowBook(id);
      setToast({
        status: 200,
        message: `Successfully borrowed "${book.title}"! Due date: ${new Date(result.dueDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })}`
      });
      
      // Update available copies
      setBook({
        ...book,
        availableCopies: book.availableCopies - 1
      });
      
      setTimeout(() => {
        navigate('/user/borrowings');
      }, 2000);
    } catch (error) {
      setToast({
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Failed to borrow book'
      });
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <>
        <UserNavbar username={user?.username || 'User'} currentPage="browse" />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading book details...</p>
        </div>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <UserNavbar username={user?.username || 'User'} currentPage="browse" />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-600">Book not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar username={user?.username || 'User'} currentPage="browse" />
      
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
        {/* Back Button */}
        <Link
          to="/user"
          className="text-4xl font-bold hover:text-[#8B5E3C] transition"
        >
          &lt;
        </Link>

        {/* Main Content */}
        <div className="flex gap-20 mt-6">
          {/* Left */}
          <div>
            <img
              src={book.coverImage || 'https://via.placeholder.com/300x430?text=No+Cover'}
              alt={book.title}
              className="w-72 h-[430px] object-cover rounded-2xl shadow-xl"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x430?text=No+Cover';
              }}
            />
          </div>

          {/* Right */}
          <div className="flex-1">
            {/* Centered Title */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#0A2947]">
                {book.title}
              </h1>
              <h2 className="text-2xl font-semibold text-[#8B5E3C] mt-3">
                {book.author}
              </h2>
            </div>

            {/* Description */}
            <div className="mt-10">
              <p className="text-lg leading-8">
                {book.description || 'No description available.'}
              </p>
            </div>

            {/* Categories */}
            {book.categories && book.categories.length > 0 && (
              <div className="mt-8">
                <p className="font-semibold text-lg mb-3">Categories</p>
                <div className="flex flex-wrap gap-3">
                  {book.categories.slice(0, 5).map((category) => (
                    <span
                      key={category}
                      className="bg-[#AACCB6] px-4 py-2 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Copies */}
            <div className="flex gap-16 mt-10">
              <div>
                <p className="font-semibold">Total Copies</p>
                <p className="text-2xl font-bold text-[#8B5E3C]">
                  {book.totalCopies || 0}
                </p>
              </div>
              <div>
                <p className="font-semibold">Available Copies</p>
                <p className="text-2xl font-bold text-[#8B5E3C]">
                  {book.availableCopies || 0}
                </p>
              </div>
            </div>

            {/* Borrow Button */}
            <div className="flex justify-center mt-12">
              <button
                onClick={handleBorrow}
                disabled={book.availableCopies === 0 || borrowing}
                className={`px-10 py-3 rounded-lg text-white transition ${
                  book.availableCopies > 0
                    ? "bg-[#8B5E3C] hover:bg-[#6d4a2e]"
                    : "bg-gray-400 cursor-not-allowed"
                } disabled:opacity-50`}
              >
                {borrowing ? 'Borrowing...' : 
                  book.availableCopies > 0
                    ? "Borrow Book"
                    : "Currently Unavailable"}
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-12 text-center text-sm italic text-green-700">
          * Fine Policy: ₹5 per day for overdue books. Borrow duration is 14 days from the date of issue.
        </p>
      </div>
    </>
  );
};

export default UserBook;