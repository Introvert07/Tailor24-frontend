import API from './api';

export const profileService = {
  // GET current user profile
  getMe: () => API.get('/auth/me'),

  // PUT update profile — name, city, measurements, profileImage (FormData)
  updateProfile: (formData) =>
    API.put('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // GET user's own orders
  getMyOrders: () => API.get('/orders/my-orders'),
};