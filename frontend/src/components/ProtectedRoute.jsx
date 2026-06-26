import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  // Only check for user in localStorage - no token check
  const userStr = localStorage.getItem('user');
  
  console.log('ProtectedRoute - userStr:', userStr);
  
  if (!userStr) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    console.log('ProtectedRoute - user:', user);
    
    if (requiredRole && user.role !== requiredRole) {
      console.log(`Wrong role. Required: ${requiredRole}, Got: ${user.role}`);
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    console.log('Error parsing user:', e);
    localStorage.removeItem('user');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute - rendering children');
  return children;
};

export default ProtectedRoute;