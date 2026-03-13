import apiClient from './client';
import { EmployeeUtilization } from '@/lib/types';

export const assignmentsApi = {
  getUtilization: async (): Promise<EmployeeUtilization[]> => {
    const response = await apiClient.get<EmployeeUtilization[]>('/assignments/utilization');
    return response.data;
  },
};
