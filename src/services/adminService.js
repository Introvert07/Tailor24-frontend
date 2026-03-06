import API from './api';

export const adminService = {
  getDashboard:      ()                         => API.get('/admin/dashboard'),
  updateOrderStatus: (orderId, status, note)    => API.put('/admin/order-status', { orderId, status, note }),
  cancelOrder:       (orderId, reason)          => API.put('/admin/order-cancel', { orderId, reason }),
  deleteUser:        (userId)                   => API.delete(`/admin/user/${userId}`),
};
