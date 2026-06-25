const axios = require('axios');

const fetchBooksFromOpenLibrary = async (limit = 50) => {
  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=subject:fiction&limit=${limit}`
    );
    
    const books = response.data.docs.map(book => ({
      title: book.title || 'Unknown Title',
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      isbn: book.isbn ? book.isbn[0] : null,
      description: book.first_sentence ? book.first_sentence[0] : 'No description available',
      coverImage: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : '',
      openLibraryId: book.key ? book.key.replace('/works/', '') : null,
      categories: book.subject || [],
      totalCopies: Math.floor(Math.random() * 5) + 1,
      availableCopies: 0
    }));

    return books;
  } catch (error) {
    console.error('Error fetching from Open Library:', error.message);
    throw error;
  }
};

module.exports = {
  fetchBooksFromOpenLibrary
};