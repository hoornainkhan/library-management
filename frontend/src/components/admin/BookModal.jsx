import { useEffect, useState } from "react";
import { createBook, updateBook } from '../../services/bookApi';

const BookModal = ({ book, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setDescription(book.description || '');
      setCover(book.coverImage || book.cover || '');
      setTotalCopies(book.totalCopies || 1);
      setCategories(book.categories || []);
    } else {
      setTitle("");
      setAuthor("");
      setDescription("");
      setCover("");
      setTotalCopies(1);
      setCategories([]);
    }
    setTagInput("");
  }, [book]);

  const handleSubmit = async () => {
    if (title.trim() === "" || author.trim() === "" || description.trim() === "") {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      coverImage: cover.trim() || '',
      totalCopies: Number(totalCopies),
      categories: categories,
    };

    try {
      let response;
      if (book && book._id) {
        // Update existing book
        response = await updateBook(book._id, bookData);
      } else {
        // Create new book
        response = await createBook(bookData);
      }
      onSave(response);
    } catch (error) {
      console.error('Error saving book:', error);
      alert(error.response?.data?.message || 'Error saving book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="bg-[#F3E4C9] rounded-2xl shadow-2xl w-175 max-h-[90vh] overflow-y-auto p-8">
        <h2 className="text-3xl font-bold text-[#0A2947] mb-8">
          {book ? "Edit Book" : "Add Book"}
        </h2>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="font-semibold">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b-2 border-gray-300 bg-transparent py-2 outline-none focus:border-[#8B5E3C]"
            />
          </div>

          {/* Author */}
          <div>
            <label className="font-semibold">Author *</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border-b-2 border-gray-300 bg-transparent py-2 outline-none focus:border-[#8B5E3C]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold">Description *</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-2 rounded-lg border border-gray-300 p-3 outline-none resize-none focus:border-[#8B5E3C]"
            />
          </div>

          {/* Cover */}
          <div>
            <label className="font-semibold">Cover Image URL</label>
            <input
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="w-full border-b-2 border-gray-300 py-2 bg-transparent outline-none focus:border-[#8B5E3C]"
            />
          </div>

          {/* Preview */}
          <div className="flex justify-center">
            {cover ? (
              <img
                src={cover}
                alt="preview"
                className="w-36 h-52 object-cover rounded-lg shadow"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150x200?text=Invalid+URL';
                }}
              />
            ) : (
              <div className="w-36 h-52 rounded-lg bg-gray-200 flex items-center justify-center">
                Preview
              </div>
            )}
          </div>

          {/* Copies */}
          <div>
            <label className="font-semibold">Total Copies</label>
            <input
              type="number"
              min={1}
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
              className="w-full border-b-2 border-gray-300 py-2 bg-transparent outline-none focus:border-[#8B5E3C]"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="font-semibold">Categories</label>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const value = tagInput.trim();
                  if (value === "") return;
                  if (categories.includes(value)) return;
                  setCategories([...categories, value]);
                  setTagInput("");
                }
                if (e.key === "Backspace" && tagInput === "") {
                  setCategories(categories.slice(0, -1));
                }
              }}
              placeholder="Press Enter after every category"
              className="w-full border-b-2 border-gray-300 py-2 bg-transparent outline-none focus:border-[#8B5E3C]"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 bg-[#AACCB6] px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => {
                      setCategories(categories.filter((_, i) => i !== index));
                    }}
                    className="font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-[#8B5E3C] hover:bg-[#B3D4C0] transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-[#8B5E3C] text-white hover:bg-[#714a2d] transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : book ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;