import { Response, NextFunction } from 'express';
import { disciplinaService } from '../services/disciplina.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { CreateDisciplinaInput, UpdateDisciplinaInput } from '../validators/disciplina.validator';

export class DisciplinaController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body as CreateDisciplinaInput;
      const result = await disciplinaService.create(data);
      sendCreated(res, result, 'Disciplina creada exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const result = await disciplinaService.getAll(includeInactive);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const result = await disciplinaService.getById(id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const data = req.body as UpdateDisciplinaInput;
      const result = await disciplinaService.update(id, data);
      sendSuccess(res, result, 'Disciplina actualizada correctamente');
    } catch (error) {
      next(error);
    }
  }

  async getDeportistas(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await disciplinaService.getDeportistas(id, page, limit);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const disciplinaController = new DisciplinaController();
