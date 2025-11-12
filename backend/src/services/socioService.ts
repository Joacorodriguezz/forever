import { ActualizarSocioRequest, GetSocioResponse } from '../types/Socio';  
import prisma from '../config/prisma';  

export async function getSocioByDni(dni: number): Promise<{ id: number } | null> {
  return prisma.socio.findFirst({
    where: { dni },
    select: {
      id: true,
    }
  });
}


// de la funcion de lu, obtengo los datos del socio que coincida con el dni
export async function getSocioCompletoByDni(dni: number): Promise<GetSocioResponse | null> {
  const socioIdResult = await getSocioByDni(dni);
  if (!socioIdResult) return null;

  const socio = await prisma.socio.findUnique({
    where: { id: socioIdResult.id },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      dni: true,
      email: true,
      fechaNacimiento: true,
      pais: true,
      sexo: true,
      fotoCarnet: true,
      usuarioId: true,
      estado: true,
    },
  });

  if (!socio) return null;

  return {
    ...socio,
    estado: socio.estado as "ACTIVO" | "INACTIVO",
  };
}


export async function deleteSocioByDni(dni: number) {
  try {
    const socioEliminado = await prisma.socio.delete({
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


export const updateSocioEstado = async (id: number, estado: 'ACTIVO' | 'INACTIVO') => {
  try {
    const socioActualizado = await prisma.socio.update({
      where: { id },
      data: { estado },
    });
    return socioActualizado;
  } catch (error) {
    throw error;
  }
};

export const getAllSocios = async () => {
  return await prisma.socio.findMany();
};

export const updateSocio = async (dni: number, data: any, fotoPath: string | null) => {
  const updateData: any = {
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    fechaNacimiento: new Date(data.fechaNacimiento),
    pais: data.pais,
    sexo: data.sexo,
  };

  if (fotoPath) {
    updateData.fotoCarnet = fotoPath;
  }

  return await prisma.socio.update({
    where: { dni: dni },
    data: updateData,
  });
};
