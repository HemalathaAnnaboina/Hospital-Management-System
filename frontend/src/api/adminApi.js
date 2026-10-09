import axiosClient from './axiosClient';

export const adminApi = {
  getDashboardStats: () => axiosClient.get('/api/admin/dashboard-stats'),
  getAllDoctors: () => axiosClient.get('/api/admin/doctors'),
  addDoctor: (data) => axiosClient.post('/api/admin/doctors', data),
  updateDoctor: (id, data) => axiosClient.put(`/api/admin/doctors/${id}`, data),
  deactivateDoctor: (id) => axiosClient.delete(`/api/admin/doctors/${id}`),
  activateDoctor: (id) => axiosClient.put(`/api/admin/doctors/${id}/activate`),
  getAllPatients: () => axiosClient.get('/api/admin/patients'),
  getAllAppointments: () => axiosClient.get('/api/admin/appointments'),
};
