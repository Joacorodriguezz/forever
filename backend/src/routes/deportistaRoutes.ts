import { Router } from 'express';
import { getAllDeportistas, getDeportistaByDni, getDeportistaCompletoByDni, updateDeportista, updateDeportistaEstado } from '../controllers/deportistaController';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import multer from 'multer';
import path from 'path';

//para la carga de fotos de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { dni } = req.body;
    const ext = path.extname(file.originalname);
    cb(null, `deportista-${dni}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

const router = Router();

// CU14 - Gestionar Deportistas (solo ADMINISTRATIVO y ADMIN)
router.get('/dni/:dni', authenticate, authorize('ADMINISTRATIVO', 'ADMIN'), getDeportistaByDni);
router.get('/dni/:dni/full', authenticate, authorize('ADMINISTRATIVO', 'ADMIN'), getDeportistaCompletoByDni);
router.get('/', authenticate, authorize('ADMINISTRATIVO', 'ADMIN'), getAllDeportistas);
router.put('/', authenticate, authorize('ADMINISTRATIVO', 'ADMIN'), upload.single('foto'), updateDeportista);
router.put('/:id/estado', authenticate, authorize('ADMINISTRATIVO', 'ADMIN'), updateDeportistaEstado);

export default router;
