import axios from 'axios';

// CONDITIONAL URL - works locally and on Vercel
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_URL = isProduction 
  ? 'https://library-management-j6ec.onrender.com/api' 
  : 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("401 FROM:", error.config?.url);
    console.log(error.response?.data);

    return Promise.reject(error);
  }
);

export default api;