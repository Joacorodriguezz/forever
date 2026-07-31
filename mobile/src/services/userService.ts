import api from '../config/api';
import type { ApiResponse, UpdateProfileRequest } from '../types/auth';

export const userService = {
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<unknown>> => {
    const response = await api.put<ApiResponse<unknown>>('/users/profile', data);
    return response.data;
  },
};
