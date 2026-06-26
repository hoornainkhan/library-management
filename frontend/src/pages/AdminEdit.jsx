import React, { useState, useEffect } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import BookModal from "../components/admin/BookModal";
import DeleteModal from "../components/admin/DeleteModal";
import { FaPlus, FaTrash, FaPen } from "react-icons/fa6";
import { getBooks, deleteBook } from '../services/bookApi';

const AdminEdit = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [showBookModal, setShowBookModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

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

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setSelectedBook(null);
    setShowBookModal(true);
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  const openDeleteModal = (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedBook) return;
    try {
      await deleteBook(selectedBook._id);
      setBooks(books.filter(b => b._id !== selectedBook._id));
      setShowDeleteModal(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleBookSaved = (savedBook) => {
    if (selectedBook) {
      // Edit mode - update existing
      setBooks(books.map(b => b._id === savedBook._id ? savedBook : b));
    } else {
      // Add mode - add new
      setBooks([savedBook, ...books]);
    }
    setShowBookModal(false);
    setSelectedBook(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading books...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Search */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#0A2947]">Book Management</h1>
          <input
            type="text"
            placeholder="Search Books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 rounded-lg border border-[#AACCB6] bg-[#fbf5ef] px-4 py-2 outline-none focus:border-[#8B5E3C]"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-5 gap-8">
          {/* Add Card */}
          <div>
            <button
              onClick={openAddModal}
              className="w-40 h-60 rounded-xl border-2 border-dashed border-[#8B5E3C] hover:bg-[#F3E4C9] transition flex items-center justify-center"
            >
              <FaPlus size={40} />
            </button>
            <p className="mt-3 text-center font-medium">Add Book</p>
          </div>

          {/* Books */}
          {filteredBooks.map((book) => (
            <div key={book._id}>
              <img
                src={book.coverImage || 'https://via.placeholder.com/150x200?text=No+Cover'}
                alt={book.title}
                className="w-40 h-60 rounded-xl object-cover shadow-lg"
              />
              <h3 className="mt-3 text-center font-medium truncate">
                {book.title}
              </h3>
              <div className="flex justify-center gap-6 mt-3">
                <button
                  onClick={() => openEditModal(book)}
                  className="text-[#8B5E3C] hover:text-[#6d4a2e]"
                >
                  <FaPen />
                </button>
                <button
                  onClick={() => openDeleteModal(book)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showBookModal && (
        <BookModal
          book={selectedBook}
          onClose={() => {
            setShowBookModal(false);
            setSelectedBook(null);
          }}
          onSave={handleBookSaved}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          book={selectedBook}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedBook(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </AdminLayout>
  );
};

export default AdminEdit;