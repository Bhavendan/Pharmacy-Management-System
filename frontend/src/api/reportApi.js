import apiClient from './axios';

export const reportApi = {
  getLowStockReport: async () => {
    const response = await apiClient.get('/api/reports/low-stock');
    return response.data;
  },
  getExpiryReport: async () => {
    const response = await apiClient.get('/api/reports/expiry');
    return response.data;
  },
  getPrescriptionReport: async () => {
    const response = await apiClient.get('/api/reports/prescriptions');
    return response.data;
  },
  getSalesReport: async () => {
    const response = await apiClient.get('/api/reports/sales');
    return response.data;
  },
};
