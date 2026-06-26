import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ONLY load user from localStorage
    const storedUser = localStorage.getItem('user');
    console.log('AuthProvider - storedUser:', storedUser);
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        console.log('AuthProvider - user loaded');
      } catch (e) {
        console.log('AuthProvider - error parsing user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    console.log('loginUser called with:', userData);
    setUser(userData);
    // User is already saved to localStorage in Login page
  };

  const logoutUser = () => {
    console.log('logoutUser called');
    setUser(null);
    localStorage.removeItem('user');
    // Token is in cookie - backend handles clearing it
  };

  const value = {
    user,
    loading,
    loginUser,
    logoutUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};