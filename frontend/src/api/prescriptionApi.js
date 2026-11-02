import apiClient from './axios';

export const prescriptionApi = {
  getAllPrescriptions: async () => {
    const response = await apiClient.get('/api/prescriptions');
    return response.data;
  },
  getPrescriptionById: async (id) => {
    const response = await apiClient.get(`/api/prescriptions/${id}`);
    return response.data;
  },
  createPrescription: async (prescriptionData) => {
    const response = await apiClient.post('/api/prescriptions', prescriptionData);
    return response.data;
  },
  updatePrescription: async (id, prescriptionData) => {
    const response = await apiClient.put(`/api/prescriptions/${id}`, prescriptionData);
    return response.data;
  },
  getPatientPrescriptions: async (patientId) => {
    const response = await apiClient.get(`/api/prescriptions/patient/${patientId}`);
    return response.data;
  },
  getDoctorPrescriptions: async (doctorId) => {
    const response = await apiClient.get(`/api/prescriptions/doctor/${doctorId}`);
    return response.data;
  },
  cancelPrescription: async (id) => {
    const response = await apiClient.put(`/api/prescriptions/${id}/cancel`);
    return response.data;
  },
  verifyPrescription: async (id) => {
    const response = await apiClient.put(`/api/prescriptions/${id}/verify`);
    return response.data;
  },
  dispensePrescription: async (id) => {
    const response = await apiClient.put(`/api/prescriptions/${id}/dispense`);
    return response.data;
  },
};
