import { ActualizarSocioRequest, GetSocioResponse } from '../types/Socio';
import prisma from '../config/prisma';
import { EstadoDeportista } from '@prisma/client';

// Socio es simplemente un alias de Deportista - redirigir a deportistaService
export async function getSocioByDni(dni: number): Promise<{ id: number } | null> {
  const deportista = await prisma.deportista.findFirst({
    where: { dni },
    select: {
      id_deportista: true,
    }
  });

  return deportista ? { id: deportista.id_deportista } : null;
}

// Obtener datos completos del socio por DNI
export async function getSocioCompletoByDni(dni: number): Promise<GetSocioResponse | null> {
  const socio = await prisma.deportista.findUnique({
    where: { dni },
    select: {
      id_deportista: true,
      nombre: true,
      apellido: true,
      dni: true,
      fechaNac: true,
      estado: true,
      categoria: true,
      obraSocial: true,
      id_cuenta: true,
      id_disciplina: true,
      id_domicilio: true,
      sexo: true,
      fotoCarnet: true,
    },
  });

  if (!socio) return null;

  return {
    id: socio.id_deportista,
    nombre: socio.nombre,
    apellido: socio.apellido,
    dni: socio.dni,
    fechaNacimiento: socio.fechaNac,
    estado: socio.estado,
    categoria: socio.categoria,
    obraSocial: socio.obraSocial,
    id_cuenta: socio.id_cuenta,
    id_disciplina: socio.id_disciplina,
    id_domicilio: socio.id_domicilio,
    sexo: socio.sexo ?? null,
    fotoCarnet: socio.fotoCarnet ?? null,
  };
}

export async function deleteSocioByDni(dni: number) {
  try {
    const socioEliminado = await prisma.deportista.delete({
      where: {
        dni: dni,
      },
    });
    return socioEliminado;
  } catch (error) {
    console.error(`Error al eliminar socio con DNI ${dni}:`, error);
    throw new Error('No se pudo eliminar el socio o no fue encontrado.');
  }
}

export const updateSocioEstado = async (id: number, estado: 'AL_DIA' | 'EN_DEUDA' | 'MOROSA' | 'INACTIVA') => {
  try {
    const socioActualizado = await prisma.deportista.update({
      where: { id_deportista: id },
      data: { estado: estado as EstadoDeportista },
    });
    return socioActualizado;
  } catch (error) {
    throw error;
  }
};

export const getAllSocios = async () => {
  return await prisma.deportista.findMany();
};

export const updateSocio = async (dni: number, data: ActualizarSocioRequest) => {
  const updateData: any = {
    nombre: data.nombre,
    apellido: data.apellido,
    fechaNac: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined,
    categoria: data.categoria,
    obraSocial: data.obraSocial,
  };

  if (data.estado) {
    updateData.estado = data.estado as EstadoDeportista;
  }

  if (data.id_disciplina) {
    updateData.id_disciplina = data.id_disciplina;
  }

  if (data.id_domicilio !== undefined) {
    updateData.id_domicilio = data.id_domicilio;
  }

  if (data.sexo !== undefined) {
    updateData.sexo = data.sexo;
  }

  if (data.fotoCarnet !== undefined) {
    updateData.fotoCarnet = data.fotoCarnet;
  }

  return await prisma.deportista.update({
    where: { dni: dni },
    data: updateData,
  });
};
