import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL;

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
// });

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
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
