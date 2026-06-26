import axios from 'axios';

// Check if we're in production or development
const isProduction = window.location.hostname !== 'localhost';
const API_URL = isProduction 
  ? 'https://library-management-j6ec.onrender.com/api'
  : 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This sends cookies automatically
});

// Remove ALL interceptors that check for tokens
// Just handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;