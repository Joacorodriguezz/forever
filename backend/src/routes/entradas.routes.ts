import { Router } from 'express';
import * as entradaController from '../controllers/entradas.controller';
import { validate } from "../middlewares/validation.middleware";
import { createEntradaSchema, updateEntradaSchema } from '../validations/entrada.validation';
import { authorize, authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', 
    authenticate,
    entradaController.getAllEntradas);

router.get('/:id',
    authenticate,
    entradaController.getEntradaById);

router.post('/',
    authenticate,
    validate(createEntradaSchema), entradaController.createEntrada);

router.put('/:id', 
    authenticate,
    authorize('ADMIN'),
    validate(updateEntradaSchema) , entradaController.updateEntrada);

export const entradaRoutes = router;