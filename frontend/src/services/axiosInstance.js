import axios from 'axios';

const normalizeUrl = (value) => {
  if (!value) return '';
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const apiOrigin = normalizeUrl(import.meta.env.VITE_API_URL);

if (!apiOrigin) {
  throw new Error('VITE_API_URL is not defined. Set it to the deployed backend origin.');
}

const baseURL = `${apiOrigin}/api`;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecotrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
