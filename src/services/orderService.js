import API from './api';

// POST /api/orders
export const createOrder = async (orderData) => {
  const { data } = await API.post('/orders', orderData);
  return data;
};

// GET /api/orders/my-orders
export const getMyOrders = async (params = {}) => {
  const { data } = await API.get('/orders/my-orders', { params });
  return data;
};

// GET /api/orders/:id  (no route for this in your backend yet, use my-orders)
export const getOrderById = async (id) => {
  const { data } = await API.get(`/orders/${id}`);
  return data;
};

// PATCH /api/orders/:id/status  with status: 'CANCELLED'
export const cancelOrder = async (id) => {
  const { data } = await API.patch(`/orders/${id}/status`, { status: 'CANCELLED' });
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await API.patch(`/orders/${id}/status`, { status });
  return data;
};