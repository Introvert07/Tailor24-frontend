import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tailor24_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';

    // Only redirect to login if token is truly missing/expired
    // NOT on every 401 (e.g. wrong password on login also returns 401)
    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/login') ||
                          error.config?.url?.includes('/auth/register');

      if (!isAuthRoute) {
        // Token expired or invalid — clear and redirect
        localStorage.removeItem('tailor24_token');
        localStorage.removeItem('tailor24_user');
        // Use replace so user can't go back to broken page
        window.location.replace('/login');
      }
    }

    return Promise.reject({ ...error, message });
  }
);
// POST /api/consultation/book
export const bookHomeConsultation = async (consultationData) => {
  const { data } = await API.post('/consultation/book', consultationData);
  return data;
};
export default API;