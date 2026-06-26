import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  // Check if user is logged in by checking localStorage for user data
  const userStr = localStorage.getItem('user');
  
  console.log('ProtectedRoute - userStr:', userStr);
  
  // If no user data, redirect to login
  if (!userStr) {
    console.log('No user data, redirecting to login');
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    console.log('ProtectedRoute - user:', user);
    
    if (requiredRole && user.role !== requiredRole) {
      console.log('Wrong role, redirecting');
      return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />;
    }
  } catch (e) {
    console.log('Error parsing user, redirecting to login');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute - rendering children');
  return children;
};

export default ProtectedRoute;