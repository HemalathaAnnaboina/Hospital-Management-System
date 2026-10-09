import axiosClient from './axiosClient';

export const patientApi = {
  getDashboard: () => axiosClient.get('/api/patient/dashboard'),
  getProfile: () => axiosClient.get('/api/patient/profile'),
  updateProfile: (data) => axiosClient.put('/api/patient/profile', data),
  bookAppointment: (data) => axiosClient.post('/api/patient/appointments', data),
  getAppointments: () => axiosClient.get('/api/patient/appointments'),
  cancelAppointment: (id, reason) => axiosClient.put(`/api/patient/appointments/${id}/cancel${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`),
  getMedicalRecords: () => axiosClient.get('/api/patient/medical-records'),
  getPrescriptions: () => axiosClient.get('/api/patient/prescriptions'),
  getBills: () => axiosClient.get('/api/patient/bills'),
};
