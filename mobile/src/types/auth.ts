export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/** Backend espera DNI en el campo email (convención web). */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseUser {
  id: number;
  email: string;
  rol: string;
  nombre?: string;
  apellido?: string;
  activo?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: LoginResponseUser;
  };
  message?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  rol: string;
  loginId: string;
  deportistaId?: number;
  nombre?: string;
  apellido?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isBootstrapping: boolean;
  loading: boolean;
  login: (dni: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export interface DeportistaProfile {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNac?: string;
  disciplina?: { id: number; nombre: string };
  genero?: { nombre: string };
  categoria?: { nombre: string };
  subcategoria?: { nombre: string };
  cuenta?: { email: string };
}

export interface Disciplina {
  id: number;
  nombre: string;
}

export interface UpdateProfileRequest {
  email?: string;
  nombre?: string;
  apellido?: string;
  disciplinaId?: number;
  currentPassword?: string;
  password?: string;
}
