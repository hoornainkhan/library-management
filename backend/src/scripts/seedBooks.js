const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
const Book = require('../models/book.model');

const fetchBooksFromGutendex = async (limit = 50) => {
  try {
    const books = [];
    const perPage = 32;
    const pagesNeeded = Math.ceil(limit / perPage);
    
    for (let page = 1; page <= pagesNeeded; page++) {
      const response = await axios.get(
        `https://gutendex.com/books/?page=${page}`
      );
      
      const pageBooks = response.data.results.map(book => ({
        title: book.title || 'Unknown Title',
        author: book.authors && book.authors.length > 0 
          ? book.authors[0].name 
          : 'Unknown Author',
        coverImage: book.formats && book.formats['image/jpeg'] 
          ? book.formats['image/jpeg']
          : 'https://via.placeholder.com/150x200?text=No+Cover',
        description: book.subjects && book.subjects.length > 0
          ? book.subjects.slice(0, 3).join(', ')
          : 'No description available',
        totalCopies: Math.floor(Math.random() * 5) + 1,
        availableCopies: 0,
        categories: book.subjects || [],
        openLibraryId: book.id ? `gutenberg-${book.id}` : null,
        isbn: null
      }));
      
      books.push(...pageBooks);
      
      if (books.length >= limit) break;
    }
    
    return books.slice(0, limit);
  } catch (error) {
    console.error('Error fetching from Gutendex:', error.message);
    throw error;
  }
};

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const existingCount = await Book.countDocuments();
    console.log(`Existing books in database: ${existingCount}`);
    
    if (existingCount > 0) {
      console.log('Clearing existing books...');
      await Book.deleteMany({});
      console.log('✅ Cleared all books');
    }
    
    console.log('Fetching 50 books from Gutendex...');
    const books = await fetchBooksFromGutendex(50);
    console.log(`✅ Fetched ${books.length} books`);
    
    let added = 0;
    for (const bookData of books) {
      try {
        bookData.availableCopies = bookData.totalCopies;
        await Book.create(bookData);
        added++;
        console.log(`Added: ${bookData.title} (${added}/${books.length})`);
      } catch (error) {
        console.error(`Error saving book: ${bookData.title}`, error.message);
      }
    }
    
    console.log(`\n✅ Successfully seeded ${added} books to database`);
    console.log(`📚 Total books in database: ${await Book.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding books:', error);
    process.exit(1);
  }
};

seedBooks();