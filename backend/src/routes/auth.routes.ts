import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { LoginSchema } from '../validations/auth.validation';
import { RegisterSchema } from '../validations/user.validation';

const router = Router();

router.post('/login',
   validate(LoginSchema),
   authController.login
);

router.post('/register', validate(RegisterSchema), authController.register);

export const authRoutes = router