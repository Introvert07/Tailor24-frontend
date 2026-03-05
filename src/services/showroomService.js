import API from './api';

// GET /api/showrooms  — all active showrooms
export const getShowrooms = async (params = {}) => {
  const { data } = await API.get('/showrooms', { params });
  return data;
};

// GET /api/showrooms/:id
export const getShowroomById = async (id) => {
  const { data } = await API.get(`/showrooms/${id}`);
  return data;
};

// GET /api/showrooms?city=Indore
export const getShowroomsByCity = async (city) => {
  const { data } = await API.get('/showrooms', { params: { city } });
  return data;
};
