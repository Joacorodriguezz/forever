import { Request, Response, NextFunction } from 'express';
export function handleError(err: any, req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  const message = err?.message || String(err);
  const stack = err?.stack || '';
  const statusCode = Number(err?.statusCode) || 500;
  console.error(`[${timestamp}] Error:`, message);
  if (stack) console.error(stack);
  try {
    res.setHeader('X-Error-Message', message);
    if (stack) res.setHeader('X-Error-Stack', stack.substring(0, 2048));
  } catch {}
  res.status(statusCode).json({
    error: 'Internal server error',
    message,
    timestamp,
  });
}