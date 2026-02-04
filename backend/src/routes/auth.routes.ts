import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

// POST /api/auth/login - CU01
router.post('/login', validateBody(loginSchema), authController.login.bind(authController));

// POST /api/auth/register - CU02 (solo Admin)
router.post(
  '/register',
  authenticateToken,
  requireAdmin,
  validateBody(registerSchema),
  authController.register.bind(authController)
);

// GET /api/auth/me - Obtener usuario autenticado
router.get('/me', authenticateToken, authController.me.bind(authController));

export default router;
