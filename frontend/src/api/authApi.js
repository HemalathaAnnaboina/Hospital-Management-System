import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/api/auth/login', credentials),
  register: (patientData) => axiosClient.post('/api/auth/register', patientData),
  getMe: () => axiosClient.get('/api/auth/me'),
};
