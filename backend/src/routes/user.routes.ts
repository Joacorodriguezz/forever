import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';
import { validateBody, validateParams } from '../middlewares/validation.middleware';
import { assignRoleSchema, updateProfileSchema, idParamSchema } from '../validators/user.validator';

const router = Router();

// GET /api/users - Listar usuarios (solo Admin)
router.get('/', authenticateToken, requireAdmin, userController.getAllUsers.bind(userController));

// GET /api/users/profile - CU16 Consultar perfil propio
router.get('/profile', authenticateToken, userController.getProfile.bind(userController));

// PUT /api/users/profile - CU17 Modificar perfil propio
router.put(
  '/profile',
  authenticateToken,
  validateBody(updateProfileSchema),
  userController.updateProfile.bind(userController)
);

// PUT /api/users/:id/role - CU03 Asignar rol (solo Admin)
router.put(
  '/:id/role',
  authenticateToken,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(assignRoleSchema),
  userController.assignRole.bind(userController)
);

// PUT /api/users/admin/:id/reset-password - Restablecer contraseña de admin (solo Admin)
router.put(
  '/admin/:id/reset-password',
  authenticateToken,
  requireAdmin,
  validateParams(idParamSchema),
  userController.resetAdminPassword.bind(userController)
);

export default router;
