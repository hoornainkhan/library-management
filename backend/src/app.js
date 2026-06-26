const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// CORS configuration - CRITICAL for production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://library-management-pink-six.vercel.app'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
const authRoutes = require('./routes/auth.route');
const bookRoutes = require('./routes/book.route');
const borrowingRoutes = require('./routes/borrowing.route');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrowing', borrowingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;