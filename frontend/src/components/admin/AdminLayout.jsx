import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  const userStr = localStorage.getItem('user');
  
  console.log('AdminLayout - userStr:', userStr);
  
  if (!userStr) {
    console.log('No user in AdminLayout, redirecting to login');
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    console.log('AdminLayout - user:', user);
    
    if (user.role !== 'admin') {
      console.log('Not admin role, redirecting');
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    console.log('Error parsing user:', e);
    localStorage.removeItem('user');
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;