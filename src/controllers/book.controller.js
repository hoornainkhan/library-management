const Book = require('../models/book.model');
const { fetchBooksFromOpenLibrary } = require('../services/openLibrary.service');

const seedBooks = async (req, res) => {
  try {
    const books = await fetchBooksFromOpenLibrary(50);
    
    let added = 0;
    let skipped = 0;

    for (const bookData of books) {
      try {
        bookData.availableCopies = bookData.totalCopies;
        const existingBook = await Book.findOne({ 
          $or: [
            { isbn: bookData.isbn },
            { openLibraryId: bookData.openLibraryId }
          ]
        });

        if (!existingBook) {
          await Book.create(bookData);
          added++;
        } else {
          skipped++;
        }
      } catch (error) {
        console.error('Error saving book:', error.message);
        skipped++;
      }
    }

    res.status(201).json({
      message: 'Books seeded successfully',
      added,
      skipped,
      total: books.length
    });
  } catch (error) {
    console.error('Seed books error:', error);
    res.status(500).json({ message: 'Error seeding books' });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const { search, category, available } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.categories = { $in: [category] };
    }

    if (available === 'true') {
      filter.availableCopies = { $gt: 0 };
    }

    const books = await Book.find(filter).sort({ title: 1 });
    res.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Error fetching book' });
  }
};

const createBook = async (req, res) => {
  try {
    const bookData = req.body;
    bookData.availableCopies = bookData.totalCopies;

    const book = new Book(bookData);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Error creating book' });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Error updating book' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Error deleting book' });
  }
};

module.exports = {
  seedBooks,
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};