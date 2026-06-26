import React from 'react';
import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const UserNavbar = ({ username = "Username", currentPage }) => {
  const { logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('user');
    logoutUser();
    window.location.href = '/';
  };

  return (
    <nav className="flex items-center justify-between px-10 py-6">
      <h1 className="text-xl font-bold text-[#022141] [font-family:Georgia,serif]">
        Library
      </h1>
      <div className="flex items-center gap-8">
        <NavLink
          to={currentPage === "browse" ? "/user/borrowings" : "/user"}
          className="text-lg font-medium hover:text-[#8B5E3C] transition"
        >
          {currentPage === "browse"
            ? "Your Borrowings"
            : "Browse Books"}
        </NavLink>
        <p className="font-semibold">{username}</p>
        <button 
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 transition"
        >
          <FiLogOut size={24} />
        </button>
      </div>
    </nav>
  );
};

export default UserNavbar;