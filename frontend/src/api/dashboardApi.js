import apiClient from './axios';

export const dashboardApi = {
  getSummary: async () => {
    const response = await apiClient.get('/api/dashboard/summary');
    return response.data;
  },
};
