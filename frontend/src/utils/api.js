import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Configure interceptor for JWT
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
