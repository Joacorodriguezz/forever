// src/routes/usuario.routes.ts
import { Router } from 'express';
import { getUsuarioConSocio } from '../controllers/usuario.controller';
const router = Router();

router.get('/:id', getUsuarioConSocio);

export const usuarioRoutes = router;
