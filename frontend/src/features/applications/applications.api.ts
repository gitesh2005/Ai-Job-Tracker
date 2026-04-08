import api from '../../lib/axios';
import { Application, CreateApplicationInput, UpdateApplicationInput, ApplicationStatus } from '../../types';

export const applicationsApi = {
  getAll: async (): Promise<Application[]> => {
    const response = await api.get('/applications');
    return response.data.data;
  },

  getById: async (id: string): Promise<Application> => {
    const response = await api.get(`/applications/${id}`);
    return response.data.data;
  },

  create: async (data: CreateApplicationInput): Promise<Application> => {
    const response = await api.post('/applications', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateApplicationInput): Promise<Application> => {
    const response = await api.patch(`/applications/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/applications/${id}`);
  },

  updateStatus: async (id: string, status: ApplicationStatus): Promise<Application> => {
    const response = await api.patch(`/applications/${id}/status`, { status });
    return response.data.data;
  },
};
