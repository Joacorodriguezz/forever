import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {  UpdateUserSchema } from '../validations/user.validation';
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

router.delete('/:id',
   authenticate,
   authorize('ADMIN'),
   userController.deleteUser
);
export const userRoutes = router;