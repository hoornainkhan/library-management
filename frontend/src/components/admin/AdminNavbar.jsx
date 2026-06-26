import React from 'react';
import { HiOutlineLogout } from "react-icons/hi";
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminNavbar = () => {
  const { logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      // Call logout endpoint (clears cookie)
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear local storage
    localStorage.removeItem('user');
    
    // Update auth context
    logoutUser();
    
    // Redirect to login
    window.location.href = '/';
  };

  return (
    <nav className="h-16 flex items-center justify-end px-8 border-b border-gray-300">
      <div className="flex items-center gap-6">
        <h2 className="text-lg font-semibold text-[#0A2947]">Admin</h2>
        <button 
          onClick={handleLogout}
          className="text-[#8B5E3C] hover:text-[#6e482d] transition cursor-pointer"
        >
          <HiOutlineLogout size={26} />
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;