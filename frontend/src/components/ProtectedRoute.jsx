import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  console.log('ProtectedRoute - userStr:', userStr);
  console.log('ProtectedRoute - token:', token);
  
  if (!userStr) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    console.log('ProtectedRoute - parsed user:', user);
    
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