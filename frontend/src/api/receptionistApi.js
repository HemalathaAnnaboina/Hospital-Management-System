import axiosClient from './axiosClient';

export const receptionistApi = {
  getDashboard: () => axiosClient.get('/api/receptionist/dashboard'),
  registerPatient: (data) => axiosClient.post('/api/receptionist/patients', data),
  searchPatients: (query) => axiosClient.get(`/api/receptionist/patients/search${query ? `?query=${encodeURIComponent(query)}` : ''}`),
  updatePatient: (id, data) => axiosClient.put(`/api/receptionist/patients/${id}`, data),
  bookAppointment: (data) => axiosClient.post('/api/receptionist/appointments', data),
  rescheduleAppointment: (id, data) => axiosClient.put(`/api/receptionist/appointments/${id}/reschedule`, data),
  cancelAppointment: (id, reason) => axiosClient.put(`/api/receptionist/appointments/${id}/cancel${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`),
  generateBill: (data) => axiosClient.post('/api/bills', data),
  getAllBills: (status) => axiosClient.get(`/api/bills${status ? `?status=${status}` : ''}`),
  payBill: (id, paymentMethod) => axiosClient.put(`/api/bills/${id}/pay?paymentMethod=${paymentMethod || 'CASH'}`),
};
