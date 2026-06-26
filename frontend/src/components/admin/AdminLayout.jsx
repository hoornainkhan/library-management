import React from 'react';
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  // Check if user is admin
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        window.location.href = '/user';
        return null;
      }
    } catch (e) {
      window.location.href = '/';
      return null;
    }
  } else {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;