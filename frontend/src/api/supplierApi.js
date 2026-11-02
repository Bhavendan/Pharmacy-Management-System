import apiClient from './axios';

export const supplierApi = {
  getAllSuppliers: async () => {
    const response = await apiClient.get('/api/suppliers');
    return response.data;
  },
  getSupplierById: async (id) => {
    const response = await apiClient.get(`/api/suppliers/${id}`);
    return response.data;
  },
  createSupplier: async (supplierData) => {
    const response = await apiClient.post('/api/suppliers', supplierData);
    return response.data;
  },
  updateSupplier: async (id, supplierData) => {
    const response = await apiClient.put(`/api/suppliers/${id}`, supplierData);
    return response.data;
  },
  deleteSupplier: async (id) => {
    const response = await apiClient.delete(`/api/suppliers/${id}`);
    return response.data;
  },
  searchSuppliers: async (query) => {
    const response = await apiClient.get('/api/suppliers/search', { params: { query } });
    return response.data;
  },
};
