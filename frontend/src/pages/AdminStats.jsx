import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { getBooks } from '../services/bookApi';
import { getAllBorrowings, getOverdueBooks, getActiveBorrowings } from '../services/borrowingApi';
import { getCurrentUser } from '../services/authApi';

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrowings: [],
    overdueBooks: [],
    totalFine: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all books
        const books = await getBooks();
        
        // Get active borrowings
        const active = await getActiveBorrowings();
        console.log('Active borrowings:', active);
        
        // Get overdue books
        const overdue = await getOverdueBooks();
        console.log('Overdue from API:', overdue);
        
        // Get ALL borrowings for fine calculation
        const allBorrowings = await getAllBorrowings();
        console.log('All borrowings:', allBorrowings);
        
        // Calculate total fine from ALL borrowings
        const totalFine = allBorrowings.reduce((sum, b) => sum + (b.fine || 0), 0);
        console.log('Total fine:', totalFine);
        
        // Calculate unique users
        const uniqueUsers = new Set();
        allBorrowings.forEach(b => {
          if (b.userId && b.userId._id) {
            uniqueUsers.add(b.userId._id);
          }
        });
        
        setStats({
          totalBooks: books.length || 0,
          totalUsers: uniqueUsers.size || 0,
          activeBorrowings: active || [],
          overdueBooks: overdue || [],
          totalFine: totalFine
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const user = getCurrentUser();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0A2947]">
            Welcome back, {user?.username || 'Admin'}!
          </h1>
        </div>

        {/* Top Row */}
        <div className="flex gap-6 mb-6">
          <div className="flex-1 bg-[#B3D4C0] rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold">Total Books</h2>
            <p className="mt-5 text-2xl">
              : <span className="ml-3 text-5xl font-bold text-[#948378]">{stats.totalBooks}</span>
            </p>
          </div>

          <div className="flex-1 bg-[#FFDBB6] rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="mt-5 text-2xl">
              : <span className="ml-3 text-5xl font-bold text-[#948378]">{stats.totalUsers}</span>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex gap-6">
          {/* Active Borrowings */}
          <div className="w-80 bg-[#F2AEBB] rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-5">Active Borrowings</h2>
            
            {/* Scrollable container with custom scrollbar */}
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scroll">
              {stats.activeBorrowings.length > 0 ? (
                stats.activeBorrowings.map((borrowing, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <p className="font-semibold text-[#0A2947]">
                      {borrowing.userId?.username || 'Unknown User'}
                    </p>
                    <p className="text-[#8B5E3C] font-medium">
                      {borrowing.bookId?.title || 'Unknown Book'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Due: {new Date(borrowing.dueDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600 py-8">
                  No active borrowings
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Overdue */}
            <div className="bg-[#AACCB6] rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-5">Overdue Books</h2>
              
              {/* Scrollable container */}
              <div className="space-y-3 max-h-32 overflow-y-auto pr-2 custom-scroll">
                {stats.overdueBooks.length > 0 ? (
                  stats.overdueBooks.map((book, index) => {
                    const fine = book.fine || 0;
                    return (
                      <div 
                        key={index} 
                        className="bg-white rounded-lg p-3 flex justify-between items-center shadow-sm"
                      >
                        <div>
                          <p className="font-medium text-[#0A2947]">
                            {book.bookId?.title || 'Unknown Book'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {book.userId?.username || 'Unknown User'}
                          </p>
                        </div>
                        <span className="text-red-600 font-bold text-lg">₹{fine}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-600 py-4">
                    No overdue books
                  </div>
                )}
              </div>
            </div>

            {/* Fine */}
            <div className="bg-[#B3D4C0] rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold">Fine to be Collected</h2>
              <p className="mt-5 text-2xl">
                : <span className="ml-3 text-5xl font-bold text-[#948378]">₹{stats.totalFine}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(139, 94, 60, 0.4);
          border-radius: 10px;
          transition: background 0.2s;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 94, 60, 0.6);
        }
        .custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 94, 60, 0.4) transparent;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminStats;