const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    sparse: true,
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  categories: [{
    type: String,
    trim: true
  }],
  openLibraryId: {
    type: String,
    sparse: true
  }
}, {
  timestamps: true
});

bookSchema.index({ isbn: 1 });

module.exports = mongoose.model('Book', bookSchema);