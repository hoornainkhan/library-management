const axios = require('axios');

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

module.exports = {
  fetchBooksFromGutendex
};