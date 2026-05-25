import api from '../config/api';
import type { ApiResponse } from '../types/auth';
import type { Noticia } from '../types/noticia';

export const noticiaService = {
  getAll: async (): Promise<ApiResponse<Noticia[]>> => {
    const response = await api.get<ApiResponse<Noticia[]>>('/noticias');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Noticia>> => {
    const response = await api.get<ApiResponse<Noticia>>(`/noticias/${id}`);
    return response.data;
  },
};
