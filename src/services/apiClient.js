import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8181';
const JOBS_FEED_URL = import.meta.env.VITE_JOBS_API_URL || 'http://167.233.98.192:8787';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const jobsFeedClient = axios.create({
  baseURL: JOBS_FEED_URL,
});

export default apiClient;
