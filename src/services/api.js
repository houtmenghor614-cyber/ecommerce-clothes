// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-ecommerce-6hef.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;