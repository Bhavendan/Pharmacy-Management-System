import apiClient from './axios';

export const inventoryApi = {
  getAllInventory: async () => {
    const response = await apiClient.get('/api/inventory');
    return response.data;
  },
  getInventoryById: async (id) => {
    const response = await apiClient.get(`/api/inventory/${id}`);
    return response.data;
  },
  getInventoryByDrug: async (drugId) => {
    const response = await apiClient.get(`/api/inventory/drug/${drugId}`);
    return response.data;
  },
  addStock: async (inventoryData) => {
    const response = await apiClient.post('/api/inventory', inventoryData);
    return response.data;
  },
  updateStock: async (id, inventoryData) => {
    const response = await apiClient.put(`/api/inventory/${id}`, inventoryData);
    return response.data;
  },
  getLowStock: async () => {
    const response = await apiClient.get('/api/inventory/low-stock');
    return response.data;
  },
  getExpiring: async () => {
    const response = await apiClient.get('/api/inventory/expiring');
    return response.data;
  },
};
