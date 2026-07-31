import api from '../config/api';
import type { ApiResponse, Disciplina } from '../types/auth';

export const disciplinaService = {
  getAll: async (): Promise<ApiResponse<Disciplina[]>> => {
    const response = await api.get<ApiResponse<Disciplina[]>>('/disciplinas');
    return response.data;
  },
};
