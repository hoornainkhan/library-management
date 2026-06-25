const Book = require('../models/book.model');
const { fetchBooksFromGutendex } = require('../services/gutendex.service');

const seedBooks = async (req, res) => {
  try {
    console.log('Starting to seed books from Gutendex...');
    
    const books = await fetchBooksFromGutendex(50);
    console.log(`Fetched ${books.length} books from Gutendex`);

    let added = 0;
    let skipped = 0;

    for (const [index, bookData] of books.entries()) {
      try {
        bookData.availableCopies = bookData.totalCopies;
        
        const existingBook = await Book.findOne({ 
          title: bookData.title,
          author: bookData.author
        });

        if (!existingBook) {
          await Book.create(bookData);
          added++;
          console.log(`Added: ${bookData.title} (${index + 1}/${books.length})`);
        } else {
          skipped++;
          console.log(`Skipped (duplicate): ${bookData.title}`);
        }
      } catch (error) {
        console.error(`Error saving book ${index + 1}:`, error.message);
        skipped++;
      }
    }

    console.log(`Seed complete - Added: ${added}, Skipped: ${skipped}`);
    
    res.status(201).json({
      message: 'Books seeded successfully from Gutendex',
      added,
      skipped,
      total: books.length
    });
  } catch (error) {
    console.error('Seed books error:', error);
    res.status(500).json({ message: 'Error seeding books: ' + error.message });
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