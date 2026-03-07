import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://tailor24-backend.vercel.app/api',
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

    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/login') ||
                          error.config?.url?.includes('/auth/register');

      if (!isAuthRoute) {
        localStorage.removeItem('tailor24_token');
        localStorage.removeItem('tailor24_user');
        window.location.replace('/login');
      }
    }

    return Promise.reject({ ...error, message });
  }
);

/**
 * SERVICE EXPORTS
 * Grouped to match frontend component imports
 */

export const contactService = {
  // Renamed to sendMessage to match Contact.jsx usage
  sendMessage: async (formData) => {
    const { data } = await API.post('/contact/submit', formData);
    return data;
  }
};

export const consultationService = {
  book: async (consultationData) => {
    const { data } = await API.post('/consultation/book', consultationData);
    return data;
  }
};

export const showroomService = {
  // Added to support your ShowroomsPage
  getAll: async () => {
    const { data } = await API.get('/showrooms');
    return data;
  }
};

export default API;