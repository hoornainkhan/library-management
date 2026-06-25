const Borrowing = require('../models/borrowing.model');
const Book = require('../models/book.model');

const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.userId;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    const activeBorrowing = await Borrowing.findOne({
      userId,
      bookId,
      status: 'borrowed'
    });

    if (activeBorrowing) {
      return res.status(400).json({ message: 'You already have this book borrowed' });
    }

    const borrowDuration = 14;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + borrowDuration);

    const borrowing = new Borrowing({
      userId,
      bookId,
      dueDate,
      borrowDate: new Date()
    });

    await borrowing.save();

    book.availableCopies -= 1;
    await book.save();

    await borrowing.populate('bookId', 'title author coverImage');
    await borrowing.populate('userId', 'username email');

    res.status(201).json({
      message: 'Book borrowed successfully',
      borrowing,
      dueDate,
      finePerDay: 5
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({ message: 'Error borrowing book' });
  }
};

const returnBook = async (req, res) => {
  try {
    const { borrowingId } = req.params;
    const userId = req.userId;

    const borrowing = await Borrowing.findOne({
      _id: borrowingId,
      userId,
      status: 'borrowed'
    });

    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }

    const returnDate = new Date();
    let fine = 0;
    let status = 'returned';

    if (returnDate > borrowing.dueDate) {
      const daysOverdue = Math.ceil(
        (returnDate - borrowing.dueDate) / (1000 * 60 * 60 * 24)
      );
      fine = daysOverdue * 5;
      status = 'overdue';
    }

    borrowing.returnDate = returnDate;
    borrowing.status = status;
    borrowing.fine = fine;
    await borrowing.save();

    const book = await Book.findById(borrowing.bookId);
    book.availableCopies += 1;
    await book.save();

    await borrowing.populate('bookId', 'title author');
    await borrowing.populate('userId', 'username email');

    res.json({
      message: 'Book returned successfully',
      borrowing,
      fine,
      status
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({ message: 'Error returning book' });
  }
};

const getUserBorrowings = async (req, res) => {
  try {
    const userId = req.userId;
    const borrowings = await Borrowing.find({ userId })
      .populate('bookId', 'title author coverImage')
      .sort({ borrowDate: -1 });

    const activeBorrowings = borrowings.filter(b => b.status === 'borrowed');
    const history = borrowings.filter(b => b.status !== 'borrowed');

    res.json({
      active: activeBorrowings,
      history,
      total: borrowings.length
    });
  } catch (error) {
    console.error('Get user borrowings error:', error);
    res.status(500).json({ message: 'Error fetching borrowings' });
  }
};

const getActiveBorrowings = async (req, res) => {
  try {
    const borrowings = await Borrowing.find({ status: 'borrowed' })
      .populate('bookId', 'title author')
      .populate('userId', 'username email')
      .sort({ dueDate: 1 });

    res.json(borrowings);
  } catch (error) {
    console.error('Get active borrowings error:', error);
    res.status(500).json({ message: 'Error fetching active borrowings' });
  }
};

const getOverdueBooks = async (req, res) => {
  try {
    const now = new Date();
    const overdue = await Borrowing.find({
      status: 'borrowed',
      dueDate: { $lt: now }
    })
      .populate('bookId', 'title author')
      .populate('userId', 'username email')
      .sort({ dueDate: 1 });

    const overdueWithFine = overdue.map(borrowing => {
      const daysOverdue = Math.ceil(
        (now - borrowing.dueDate) / (1000 * 60 * 60 * 24)
      );
      return {
        ...borrowing.toObject(),
        daysOverdue,
        fine: daysOverdue * 5
      };
    });

    res.json(overdueWithFine);
  } catch (error) {
    console.error('Get overdue books error:', error);
    res.status(500).json({ message: 'Error fetching overdue books' });
  }
};

const getAllBorrowings = async (req, res) => {
  try {
    const borrowings = await Borrowing.find({})
      .populate('bookId', 'title author')
      .populate('userId', 'username email')
      .sort({ borrowDate: -1 });

    res.json(borrowings);
  } catch (error) {
    console.error('Get all borrowings error:', error);
    res.status(500).json({ message: 'Error fetching borrowings' });
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getUserBorrowings,
  getActiveBorrowings,
  getOverdueBooks,
  getAllBorrowings
};