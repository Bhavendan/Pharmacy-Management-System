import apiClient from './axios';

export const drugApi = {
  getAllDrugs: async () => {
    const response = await apiClient.get('/api/drugs');
    return response.data;
  },
  getDrugById: async (id) => {
    const response = await apiClient.get(`/api/drugs/${id}`);
    return response.data;
  },
  createDrug: async (drugData) => {
    const response = await apiClient.post('/api/drugs', drugData);
    return response.data;
  },
  updateDrug: async (id, drugData) => {
    const response = await apiClient.put(`/api/drugs/${id}`, drugData);
    return response.data;
  },
  deleteDrug: async (id) => {
    const response = await apiClient.delete(`/api/drugs/${id}`);
    return response.data;
  },
  deactivateDrug: async (id) => {
    const response = await apiClient.put(`/api/drugs/${id}/deactivate`);
    return response.data;
  },
  searchDrugs: async (query) => {
    const response = await apiClient.get(`/api/drugs/search`, { params: { query } });
    return response.data;
  },
};
