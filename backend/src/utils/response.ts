import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message: string = 'Recurso creado exitosamente'
): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  error: string,
  statusCode: number = 400,
  errors?: Record<string, string[]>
): Response {
  const response: ApiResponse = {
    success: false,
    error,
    errors,
  };
  return res.status(statusCode).json(response);
}

export function sendNotFound(
  res: Response,
  message: string = 'Recurso no encontrado'
): Response {
  return sendError(res, message, 404);
}

export function sendUnauthorized(
  res: Response,
  message: string = 'No autorizado'
): Response {
  return sendError(res, message, 401);
}

export function sendForbidden(
  res: Response,
  message: string = 'Acceso denegado'
): Response {
  return sendError(res, message, 403);
}

export function sendValidationError(
  res: Response,
  errors: Record<string, string[]>
): Response {
  return sendError(res, 'Error de validacion', 400, errors);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number
): Response {
  const response: PaginatedResponse<T> = {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
  return res.status(200).json({
    success: true,
    ...response,
  });
}
