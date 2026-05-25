import api from '../config/api';
import type { ApiResponse, LoginRequest, LoginResponse, LoginResponseUser, UpdateProfileRequest } from '../types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<LoginResponseUser>> => {
    const response = await api.get<ApiResponse<LoginResponseUser>>('/auth/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<unknown>> => {
    const response = await api.put<ApiResponse<unknown>>('/users/profile', data);
    return response.data;
  },
};
