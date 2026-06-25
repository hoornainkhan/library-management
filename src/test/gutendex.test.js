const { fetchBooksFromGutendex } = require('../services/gutendex.service');

const testGutendex = async () => {
  try {
    console.log('Testing Gutendex API...');
    const books = await fetchBooksFromGutendex(10);
    
    console.log(`✅ Fetched ${books.length} books`);
    console.log('\nSample books:');
    books.slice(0, 3).forEach((book, i) => {
      console.log(`${i + 1}. ${book.title} - ${book.author}`);
      console.log(`   Cover: ${book.coverImage.substring(0, 60)}...`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testGutendex();