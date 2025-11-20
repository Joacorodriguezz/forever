import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UpdateUserSchema } from '../validations/user.validation';
import { UpdateProfileSchema, AssignRoleSchema } from '../validations/profile.validation';
import { upload } from '../middlewares/comprobantes.middleware';

const router = Router();

//creo que no se usa
router.get(
   '/',
   authenticate,        
   userController.getAllUsers
);

router.get(
  '/administrativos',
  authenticate,
  authorize('ADMIN'),  
  userController.getAdministrativos
);

router.get(
  "/socios",
  authenticate,
  authorize('ADMIN', 'ADMINISTRATIVO'), 
  userController.getSocios
);

// CU16 - Consultar Perfil
router.get(
  '/profile/me',
  authenticate,
  userController.getOwnProfile
);

// CU17 - Modificar Perfil
router.put(
  '/profile/me',
  authenticate,
  validate(UpdateProfileSchema),
  userController.updateOwnProfile
);

router.get(
   '/:id',
   authenticate,
   userController.getUserById
);

router.put('/:id',
   authenticate,
   upload.single("foto"),
   validate(UpdateUserSchema),
   userController.updateUser
);

// CU03 - Asignar Rol
router.patch(
  '/:id/role',
  authenticate,
  authorize('ADMIN'),
  validate(AssignRoleSchema),
  userController.assignRole
);

router.delete('/:id',
   authenticate,
   authorize('ADMIN'),
   userController.deleteUser
);
export const userRoutes = router;