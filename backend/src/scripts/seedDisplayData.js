const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/user.model');
const Book = require('../models/book.model');
const Borrowing = require('../models/borrowing.model');

const seedDisplayData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Clear existing data
    await User.deleteMany({});
    await Borrowing.deleteMany({});
    console.log('✅ Cleared existing users and borrowings\n');

    // 1. Create Users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.insertMany([
      {
        username: 'user1',
        email: 'user1@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true
      },
      {
        username: 'user3',
        email: 'user3@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true
      },
      {
        username: 'user4',
        email: 'user4@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true
      },
      {
        username: 'admin',
        email: 'admin@library.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        isActive: true
      }
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // 2. Get Books
    const books = await Book.find({});
    if (books.length < 10) {
      console.log('❌ Need at least 10 books. Run seed-books first.');
      process.exit(1);
    }
    console.log(`📚 Using ${books.length} books from database\n`);

    // Map books by title for easy lookup
    const bookMap = {};
    books.forEach(b => {
      bookMap[b.title] = b;
    });

    // 3. Reset all book copies
    await Book.updateMany({}, { $set: { availableCopies: 5 } });
    console.log('✅ Reset all books to 5 available copies\n');

    // 4. Create Borrowings
    console.log('Creating borrowings...\n');

    const borrowings = [];
    const borrowedBookIds = [];

    // Helper to get book by title
    const getBookByTitle = (title) => {
      const book = bookMap[title];
      if (!book) {
        console.log(`⚠️ Book not found: "${title}"`);
        return null;
      }
      if (borrowedBookIds.includes(book._id.toString())) {
        console.log(`⚠️ "${title}" already borrowed, skipping`);
        return null;
      }
      return book;
    };

    // --- ACTIVE BORROWINGS (10) ---
    const activeBooks = [
      { title: 'Moby Dick; Or, The Whale', user: users[0] },
      { title: 'Pride and Prejudice', user: users[0] },
      { title: 'The Hobbit', user: users[1] },
      { title: '1984', user: users[1] },
      { title: 'The Great Gatsby', user: users[2] },
      { title: 'Dracula', user: users[2] },
      { title: 'Frankenstein; or, the modern prometheus', user: users[3] },
      { title: 'Wuthering Heights', user: users[3] },
      { title: 'The Picture of Dorian Gray', user: users[0] },
      { title: 'The Catcher in the Rye', user: users[4] }
    ];

    for (const data of activeBooks) {
      const book = getBookByTitle(data.title);
      if (!book) continue;
      
      borrowedBookIds.push(book._id.toString());
      
      const borrowDate = new Date();
      borrowDate.setDate(borrowDate.getDate() - Math.floor(Math.random() * 10) - 1);
      
      const dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + 14);
      
      borrowings.push({
        userId: data.user._id,
        bookId: book._id,
        borrowDate: borrowDate,
        dueDate: dueDate,
        returnDate: null,
        status: 'borrowed',
        fine: 0,
        finePaid: false
      });
      
      await Book.findByIdAndUpdate(book._id, { $inc: { availableCopies: -1 } });
      console.log(`📖 ${data.user.username} borrowed "${book.title}"`);
    }

    // --- OVERDUE BORROWINGS (5) ---
    const overdueBooks = [
      { title: 'Jane Eyre: An Autobiography', user: users[0], daysOverdue: 6, fine: 30 },
      { title: 'A Tale of Two Cities', user: users[1], daysOverdue: 4, fine: 20 },
      { title: 'Crime and Punishment', user: users[2], daysOverdue: 11, fine: 55 },
      { title: 'The Adventures of Sherlock Holmes', user: users[3], daysOverdue: 2, fine: 10 },
      { title: 'To Kill a Mockingbird', user: users[4], daysOverdue: 16, fine: 80 }
    ];

    for (const data of overdueBooks) {
      const book = getBookByTitle(data.title);
      if (!book) continue;
      
      borrowedBookIds.push(book._id.toString());
      
      const borrowDate = new Date();
      borrowDate.setDate(borrowDate.getDate() - data.daysOverdue - 14);
      
      const dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + 14);
      
      borrowings.push({
        userId: data.user._id,
        bookId: book._id,
        borrowDate: borrowDate,
        dueDate: dueDate,
        returnDate: null,
        status: 'overdue',
        fine: data.fine,
        finePaid: false
      });
      
      await Book.findByIdAndUpdate(book._id, { $inc: { availableCopies: -1 } });
      console.log(`⚠️ ${data.user.username} has overdue "${book.title}" (fine: ₹${data.fine})`);
    }

    // --- RETURNED BORROWINGS (5) ---
    const returnedBooks = [
      { title: 'Little Women; Or, Meg, Jo, Beth, and Amy', user: users[0] },
      { title: 'The Count of Monte Cristo', user: users[1] },
      { title: 'Alice\'s Adventures in Wonderland', user: users[2] },
      { title: 'The Adventures of Tom Sawyer, Complete', user: users[3] },
      { title: 'Middlemarch', user: users[4] }
    ];

    for (const data of returnedBooks) {
      const book = getBookByTitle(data.title);
      if (!book) continue;
      
      borrowedBookIds.push(book._id.toString());
      
      const borrowDate = new Date();
      borrowDate.setDate(borrowDate.getDate() - Math.floor(Math.random() * 20) - 15);
      
      const dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + 14);
      
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() - Math.floor(Math.random() * 10) - 1);
      
      const wasLate = returnDate > dueDate;
      const lateDays = wasLate ? Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24)) : 0;
      const fine = lateDays * 5;
      
      borrowings.push({
        userId: data.user._id,
        bookId: book._id,
        borrowDate: borrowDate,
        dueDate: dueDate,
        returnDate: returnDate,
        status: wasLate ? 'overdue' : 'returned',
        fine: fine,
        finePaid: wasLate ? false : true
      });
      
      if (wasLate) {
        console.log(`✅ ${data.user.username} returned "${book.title}" (late, fine: ₹${fine})`);
      } else {
        console.log(`✅ ${data.user.username} returned "${book.title}" (on time)`);
      }
    }

    // Insert all borrowings
    await Borrowing.insertMany(borrowings);
    console.log(`\n✅ Created ${borrowings.length} borrowings`);

    // 5. Summary
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalBorrowings = await Borrowing.countDocuments();
    const activeCount = await Borrowing.countDocuments({ status: 'borrowed' });
    const overdueCount = await Borrowing.countDocuments({ status: 'overdue' });
    const returnedCount = await Borrowing.countDocuments({ status: 'returned' });

    // Calculate total fine
    const fineResult = await Borrowing.aggregate([
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]);
    const totalFine = fineResult.length > 0 ? fineResult[0].total : 0;

    console.log('\n📊 Database Summary:');
    console.log(`👤 Users: ${totalUsers} (1 admin, ${totalUsers - 1} users)`);
    console.log(`📚 Books: ${totalBooks}`);
    console.log(`📖 Borrowings: ${totalBorrowings}`);
    console.log(`   - Active: ${activeCount}`);
    console.log(`   - Overdue: ${overdueCount}`);
    console.log(`   - Returned: ${returnedCount}`);
    console.log(`💰 Total Fine to Collect: ₹${totalFine}`);

    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@library.com / admin123');
    console.log('Users (all with password: password123):');
    users.filter(u => u.role === 'user').forEach(u => {
      console.log(`   - ${u.username}: ${u.email}`);
    });

    console.log('\n✅ Display data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDisplayData();