import apiClient from './axios';

export const billApi = {
  getAllBills: async () => {
    const response = await apiClient.get('/api/bills');
    return response.data;
  },
  getBillById: async (id) => {
    const response = await apiClient.get(`/api/bills/${id}`);
    return response.data;
  },
  getPatientBills: async (patientId) => {
    const response = await apiClient.get(`/api/bills/patient/${patientId}`);
    return response.data;
  },
  createBill: async (billData) => {
    const response = await apiClient.post('/api/bills', billData);
    return response.data;
  },
  updatePayment: async (id, paymentData) => {
    const response = await apiClient.put(`/api/bills/${id}/payment`, paymentData);
    return response.data;
  },
};
