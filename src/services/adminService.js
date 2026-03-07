import API from './api';

export const adminService = {
  getDashboard:      ()                         => API.get('/admin/dashboard'),
  updateOrderStatus: (orderId, status, note)    => API.put('/admin/order-status', { orderId, status, note }),
  cancelOrder:       (orderId, reason)          => API.put('/admin/order-cancel', { orderId, reason }),
  deleteUser:        (userId)                   => API.delete(`/admin/user/${userId}`),

  // ── Inquiry ──────────────────────────────────────────────
  getInquiries:          ()                              => API.get('/admin/inquiries'),
  updateInquiryStatus:   (inquiryId, status)             => API.put('/admin/inquiry-status', { inquiryId, status }),
  deleteInquiry:         (inquiryId)                     => API.delete(`/admin/inquiry/${inquiryId}`),
    updateConsultationStatus: (id, status) => API.put('/admin/consultation-status', { id, status }),
    deleteConsultation: (id) => API.delete(`/admin/consultation/${id}`),
};
