import { Routes, Route } from "react-router-dom";
import React from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import ToastContainer from './components/ToastContainer';
import AdminStats from './pages/AdminStats';
import AdminLogs from './pages/AdminLogs';
import AdminEdit from './pages/AdminEdit';
import UserBrowse from "./pages/UserBrowse";
import UserBook from "./pages/UserBook";
import UserBorrowings from "./pages/UserBorrowings";
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminStats />
          </ProtectedRoute>
        } />
        <Route path="/admin/logs" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLogs />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit" element={
          <ProtectedRoute requiredRole="admin">
            <AdminEdit />
          </ProtectedRoute>
        } />
        
        {/* User Routes */}
        <Route path="/user" element={
          <ProtectedRoute requiredRole="user">
            <UserBrowse />
          </ProtectedRoute>
        } />
        <Route path="/user/book/:id" element={
          <ProtectedRoute requiredRole="user">
            <UserBook />
          </ProtectedRoute>
        } />
        <Route path="/user/borrowings" element={
          <ProtectedRoute requiredRole="user">
            <UserBorrowings />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
};

export default App;