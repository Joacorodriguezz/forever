import { Request, Response } from 'express';
import { canchaService } from '../services/cancha.service';

export const canchaController = {
  async listarPorActividad(req: Request, res: Response) {
    const actividadId = Number(req.params.actividadId);
    if (Number.isNaN(actividadId)) return res.status(400).json({ message: 'actividadId inválido' });
    const canchas = await canchaService.listarPorActividad(actividadId);
    return res.json({ canchas });
  },

  async crear(req: Request, res: Response) {
    const { nombre, descripcion, actividadId, activa } = req.body;
    if (!nombre || !actividadId) return res.status(400).json({ message: 'nombre y actividadId son requeridos' });
    const cancha = await canchaService.crear({ nombre: String(nombre).trim(), descripcion: descripcion ?? null, actividadId: Number(actividadId), activa });
    return res.status(201).json({ cancha });
  },

  async actualizar(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'id inválido' });
    const { nombre, descripcion, activa } = req.body;
    const cancha = await canchaService.actualizar(id, { nombre, descripcion, activa });
    return res.json({ cancha });
  },

  async eliminar(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'id inválido' });
    await canchaService.eliminar(id);
    return res.status(204).send();
  },
};


