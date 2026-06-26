import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { logout } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';

const UserNavbar = ({ username = "Username", currentPage }) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logout();
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-10 py-6">
      {/* Left */}
      <h1 className="text-xl font-bold text-[#022141] [font-family:Georgia,serif]">
        Library
      </h1>

      {/* Right */}
      <div className="flex items-center gap-8">
        <NavLink
          to={currentPage === "browse" ? "/user/borrowings" : "/user"}
          className="text-lg font-medium hover:text-[#8B5E3C] transition"
        >
          {currentPage === "browse"
            ? "Your Borrowings"
            : "Browse Books"}
        </NavLink>

        <p className="font-semibold">
          {username}
        </p>

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