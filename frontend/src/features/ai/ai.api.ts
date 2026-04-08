import api from '../../lib/axios';
import { ParsedJobData } from '../../types';

export const aiApi = {
  parseJobDescription: async (jobDescription: string): Promise<ParsedJobData> => {
    const response = await api.post('/ai/parse-job-description', { jobDescription });
    return response.data.data;
  },
};
