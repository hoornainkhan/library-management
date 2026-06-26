import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogout } from "react-icons/hi";
import { logout } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logout();
    logoutUser();
    navigate('/');
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