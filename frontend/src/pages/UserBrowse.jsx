import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import UserNavbar from "../components/user/UserNavbar";
import { getBooks } from '../services/bookApi';
import { getCurrentUser } from '../services/authApi';

const UserBrowse = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getBooks();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <UserNavbar username={user?.username || 'User'} currentPage="browse" />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading books...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar username={user?.username || 'User'} currentPage="browse" />
      <div className="px-10 pb-10">
        {/* Heading & Search */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl text-center font-bold text-[#0A2947]">
            Explore Books
          </h1>
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 rounded-lg border border-[#AACCB6] bg-[#fbf5ef] px-4 py-2 outline-none focus:border-[#8B5E3C]"
          />
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-5 gap-8">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <NavLink
                key={book._id}
                to={`/user/book/${book._id}`}
                className="flex flex-col items-center hover:scale-105 transition duration-300"
              >
                <img
                  src={book.coverImage || 'https://via.placeholder.com/150x200?text=No+Cover'}
                  alt={book.title}
                  className="w-40 h-60 rounded-xl object-cover shadow-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x200?text=No+Cover';
                  }}
                />
                <h3 className="mt-3 w-40 text-center font-medium truncate text-[#0A2947]">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 truncate w-40 text-center">
                  {book.author}
                </p>
              </NavLink>
            ))
          ) : (
            <div className="col-span-5 text-center text-gray-500 text-lg">
              {search ? 'No books found matching your search.' : 'No books available.'}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserBrowse;