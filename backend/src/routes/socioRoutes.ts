import { Router } from 'express';
import { getAllSocios, getSocioByDni, getSocioCompletoByDni, updateSocio, updateSocioEstado } from '../controllers/socioController';
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
    cb(null, `socio-${dni}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

const router = Router();


router.get('/dni/:dni', getSocioByDni);
router.get('/dni/:dni/full', getSocioCompletoByDni);
router.get('/', getAllSocios);
router.put('/', upload.single('foto'), updateSocio);
router.put('/:id/estado', updateSocioEstado);

export default router;

