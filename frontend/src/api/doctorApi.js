import axiosClient from './axiosClient';

export const doctorApi = {
  getDashboard: () => axiosClient.get('/api/doctor/dashboard'),
  getTodayAppointments: () => axiosClient.get('/api/doctor/appointments/today'),
  getAllAppointments: () => axiosClient.get('/api/doctor/appointments'),
  updateStatus: (id, status, cancellationReason) => {
    let url = `/api/doctor/appointments/${id}/status?status=${status}`;
    if (cancellationReason) {
      url += `&cancellationReason=${encodeURIComponent(cancellationReason)}`;
    }
    return axiosClient.put(url);
  },
  getPatientDetails: (patientId) => axiosClient.get(`/api/doctor/patients/${patientId}`),
  getPatientRecords: (patientId) => axiosClient.get(`/api/doctor/patients/${patientId}/records`),
  getPatientPrescriptions: (patientId) => axiosClient.get(`/api/doctor/patients/${patientId}/prescriptions`),
  createMedicalRecord: (data) => axiosClient.post('/api/medical-records', data),
  createPrescription: (data) => axiosClient.post('/api/prescriptions', data),
};
