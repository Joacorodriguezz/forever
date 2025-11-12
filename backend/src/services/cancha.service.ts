import prisma from '../config/prisma';
import { ActualizarCanchaDTO, CrearCanchaDTO } from '../types/cancha';

export const canchaService = {
  async listarPorActividad(actividadId: number) {
    return prisma.cancha.findMany({
      where: { actividadId },
      orderBy: { id: 'asc' },
    });
  },

  async crear(data: CrearCanchaDTO) {
    return prisma.cancha.create({ data });
  },

  async actualizar(id: number, data: ActualizarCanchaDTO) {
    return prisma.cancha.update({ where: { id }, data });
  },

  async eliminar(id: number) {
    await prisma.$transaction(async (tx) => {
      // Buscar todos los eventos de esta cancha
      const eventos = await tx.evento.findMany({
        where: { canchaId: id },
        select: { id: true },
      });

      const eventoIds = eventos.map((e) => e.id);

      // Eliminar entradas asociadas a esos eventos
      if (eventoIds.length > 0) {
        await tx.entrada.deleteMany({
          where: { eventoId: { in: eventoIds } },
        });
      }

      // Eliminar los eventos asociados
      await tx.evento.deleteMany({
        where: { canchaId: id },
      });

      // Finalmente, eliminar la cancha
      await tx.cancha.delete({
        where: { id },
      });

      console.log(`Cancha ${id} eliminada correctamente`);
    });
  },
};

