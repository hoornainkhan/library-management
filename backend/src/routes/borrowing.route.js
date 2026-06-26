const express = require('express');
const router = express.Router();
const {
  borrowBook,
  returnBook,
  getUserBorrowings,
  getActiveBorrowings,
  getOverdueBooks,
  getAllBorrowings,
  getDashboardStats
} = require('../controllers/borrowing.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

router.post('/borrow', authenticate, borrowBook);
router.put('/return/:borrowingId', authenticate, returnBook);
router.get('/my-borrowings', authenticate, getUserBorrowings);
router.get('/active', authenticate, isAdmin, getActiveBorrowings);
router.get('/overdue', authenticate, isAdmin, getOverdueBooks);
router.get('/all', authenticate, isAdmin, getAllBorrowings);
router.get('/stats', authenticate, isAdmin, getDashboardStats);

module.exports = router;