import apiClient from './axios';

export const userApi = {
  getAllUsers: async () => {
    const response = await apiClient.get('/api/users');
    return response.data;
  },
  getUserById: async (id) => {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },
  createUser: async (userData) => {
    const response = await apiClient.post('/api/users', userData);
    return response.data;
  },
  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/api/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  },
  enableUser: async (id) => {
    const response = await apiClient.put(`/api/users/${id}/enable`);
    return response.data;
  },
  disableUser: async (id) => {
    const response = await apiClient.put(`/api/users/${id}/disable`);
    return response.data;
  },
};
