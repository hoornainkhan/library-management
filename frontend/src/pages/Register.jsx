import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const registerImgUrl = "https://ik.imagekit.io/hoori/library-1.jpg?updatedAt=1782460942650";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginUser } = useAuth();

  // Check if we're in production or development
  const isProduction = window.location.hostname !== 'localhost';
  const API_URL = isProduction 
    ? 'https://library-management-j6ec.onrender.com/api'
    : 'http://localhost:3000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
        role: 'user'
      }, {
        withCredentials: true
      });

      const { user } = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      loginUser(user);
      
      window.location.href = '/user';
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='bg-[#F3E4C9] h-[86vh] w-[60vw] rounded-sm shadow-lg flex justify-between'>
        <div>
          <img
            src={registerImgUrl}
            alt="Library"
            className="h-full object-cover w-[25vw] rounded-l-md"
          />
        </div>
        
        <div className='flex flex-col w-[35vw] justify-center items-center'>
          <div>
            <h1 className='text-4xl font-bold'>Create an Account</h1>
          </div>
          <div>
            <h4 className='pb-8'>Already have an account? <Link className='text-amber-600' to="/">Log in</Link></h4>
          </div>
          
          {error && (
            <div className="w-[70%] mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className='w-[70%]'>
            <div className='pb-4'>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-b-2 border-gray-500 bg-transparent outline-none py-2 focus:border-blue-500 transition-colors duration-300"
                required
              />
            </div>
            
            <div className='pb-4'>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-gray-500 bg-transparent outline-none py-2 focus:border-blue-500 transition-colors duration-300"
                required
              />
            </div>
            
            <div className="pb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-gray-500 bg-transparent outline-none py-2 pr-8 focus:border-blue-500 transition-colors duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            <div className="pb-4 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-b-2 border-gray-500 bg-transparent outline-none py-2 pr-8 focus:border-blue-500 transition-colors duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B5E3C] text-white py-3 rounded-md font-semibold hover:bg-[#744c2f] transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;