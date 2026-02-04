export interface LoginRequest {
  emailOdni: string;  // Can be email or DNI
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id_cuenta: number;
    mail: string;
    deportista?: any;
    administrativo?: any;
  };
}
