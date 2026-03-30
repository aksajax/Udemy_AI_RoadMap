import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// This runs BEFORE every request is sent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // Ensure this key matches your login storage key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Use 'Token' or 'Bearer' depending on your Django setup
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;