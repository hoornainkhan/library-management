const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  },
  fine: {
    type: Number,
    default: 0
  },
  finePaid: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

borrowingSchema.index({ userId: 1, status: 1 });
borrowingSchema.index({ bookId: 1, status: 1 });
borrowingSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Borrowing', borrowingSchema);