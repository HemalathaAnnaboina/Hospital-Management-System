import axiosClient from './axiosClient';

export const commonApi = {
  getDepartments: () => axiosClient.get('/api/departments'),
  getAllDepartments: () => axiosClient.get('/api/departments/all'),
  createDepartment: (data) => axiosClient.post('/api/departments', data),
  getDoctors: (departmentId) => axiosClient.get(`/api/doctors${departmentId ? `?departmentId=${departmentId}` : ''}`),
  getDoctorDetails: (id) => axiosClient.get(`/api/doctors/${id}`),
  getAvailableSlots: (doctorId, date) => axiosClient.get(`/api/appointments/available-slots?doctorId=${doctorId}&date=${date}`),
  getMedicines: (search) => axiosClient.get(`/api/medicines${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  addMedicine: (data) => axiosClient.post('/api/medicines', data),
};
