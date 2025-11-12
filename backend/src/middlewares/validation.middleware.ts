import { ZodError, ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const input = {
      body: req.body,
      params: req.params,
      query: req.query,
      file: (req as any).file,
      files: (req as any).files,
    };

    const combined = await (schema as any).safeParseAsync?.(input);
    if (combined?.success) {
      const parsed = combined.data;
      if (parsed.body !== undefined) req.body = parsed.body;
      (req as any).validated = parsed;
      return next();
    }

    const asBody = await (schema as any).safeParseAsync?.(req.body);
    if (asBody?.success) {
      req.body = asBody.data;
      (req as any).validated = { body: asBody.data };
      return next();
    }

    const issues = combined?.error?.issues ?? asBody?.error?.issues ?? [];
    console.log('Errores de validación:', issues);
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos',
      errors: issues.map((err: any) => ({
        field: Array.isArray(err.path) ? err.path.join('.') : String(err.path ?? ''),
        message: err.message,
      })),
    });
  };
};

// Variante que valida sin tocar req (no reescribe body/params/query)
export const validateSafe = (schema: ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const input = {
      body: req.body,
      params: req.params,
      query: req.query,
      file: (req as any).file,
      files: (req as any).files,
    };

    const result = await (schema as any).safeParseAsync?.(input);
    if (result?.success) return next();

    const issues = result?.error?.issues ?? [];
    console.log('Errores de validación (safe):', issues);
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos',
      errors: issues.map((err: any) => ({
        field: Array.isArray(err.path) ? err.path.join('.') : String(err.path ?? ''),
        message: err.message,
      })),
    });
  };
};
