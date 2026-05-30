import api from './api';

// Email/Password Login
export const login = async (email, password) => {
  const response = await api.post('/users/login', { email, password });
  return response.data;
};

// Email/Password Register
export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

// Google Login
export const googleLogin = () => {
  window.location.href = 'http://localhost:8000/api/auth/google/login';
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

// Google Logout
export const googleLogout = async () => {
  const response = await api.post('/auth/google/logout');
  return response.data;
};