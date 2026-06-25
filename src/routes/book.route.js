const express = require('express');
const router = express.Router();
const {
  seedBooks,
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/book.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

router.get('/seed', authenticate, isAdmin, seedBooks);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', authenticate, isAdmin, createBook);
router.put('/:id', authenticate, isAdmin, updateBook);
router.delete('/:id', authenticate, isAdmin, deleteBook);

module.exports = router;