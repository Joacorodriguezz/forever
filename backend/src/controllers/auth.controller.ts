import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { LoginInput, RegisterInput } from '../validators/auth.validator';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body as LoginInput;
      const result = await authService.login(data);
      sendSuccess(res, result, 'Inicio de sesion exitoso');
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body as RegisterInput;
      const result = await authService.register(data);
      sendCreated(res, result, 'Usuario registrado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'No autorizado' });
        return;
      }
      sendSuccess(res, req.user);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
