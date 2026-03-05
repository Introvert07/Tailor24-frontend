import API from './api';

// POST /api/auth/register
export const registerUser = async (userData) => {
  const { data } = await API.post('/auth/register', userData);
  return data;
};

// POST /api/auth/login
export const loginUser = async (credentials) => {
  const { data } = await API.post('/auth/login', credentials);
  return data;
};

// GET /api/auth/me  (get current user profile)
export const getMe = async () => {
  const { data } = await API.get('/auth/me');
  return data;
};

// PUT /api/auth/profile  (update profile / measurements)
export const updateProfile = async (profileData) => {
  const { data } = await API.put('/auth/profile', profileData);
  return data;
};

// POST /api/auth/logout (optional token blacklist)
export const logoutUser = async () => {
  try { await API.post('/auth/logout'); } catch (_) {}
  localStorage.removeItem('tailor24_token');
  localStorage.removeItem('tailor24_user');
};
