import { Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { AssignRoleInput, UpdateProfileInput } from '../validators/user.validator';

export class UserController {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await userService.getProfile(userId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = req.body as UpdateProfileInput;
      const result = await userService.updateProfile(userId, data);
      sendSuccess(res, result, 'Perfil actualizado correctamente');
    } catch (error) {
      next(error);
    }
  }

  async assignRole(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const targetUserId = parseInt(req.params.id as string, 10);
      const data = req.body as AssignRoleInput;
      const result = await userService.assignRole(userId, targetUserId, data);
      sendSuccess(res, result, 'Rol asignado correctamente');
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await userService.getAllUsers(page, limit);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async resetAdminPassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = parseInt(req.params.id as string, 10);
      const { newPassword } = req.body;
      const result = await userService.resetAdminPassword(adminId, newPassword);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
