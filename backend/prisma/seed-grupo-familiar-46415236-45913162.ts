import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { PrismaClient, Rol, EstadoDeportista } from '@prisma/client';

dotenv.config();

const DNI_TITULAR = '46415236';
const DNI_HERMANO = '45913162';

const prisma = new PrismaClient();

async function ensurePrismaColumns() {
  await prisma.$executeRawUnsafe(
    'ALTER TABLE deportistas ADD COLUMN IF NOT EXISTS obra_social TEXT'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE deportistas ADD COLUMN IF NOT EXISTS enfermedades TEXT'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE deportistas ADD COLUMN IF NOT EXISTS telefonos TEXT'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE disciplinas ADD COLUMN IF NOT EXISTS descripcion TEXT'
  );
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "grupo_familiar_integrantes" ADD COLUMN IF NOT EXISTS "es_principal" BOOLEAN NOT NULL DEFAULT false`
  );
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "grupos_familiares" ADD COLUMN IF NOT EXISTS "titular_dni" VARCHAR(20)`
  );
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "grupos_familiares" ADD COLUMN IF NOT EXISTS "cuota_hermano" DECIMAL(10,2)`
  );
}

async function insertGrupoFamiliarIntegrante(
  grupoId: number,
  deportistaId: number,
  esPrincipal: boolean
) {
  await prisma.$executeRaw`
    INSERT INTO "grupo_familiar_integrantes" ("id_grupo_familiar", "id_deportista", "es_principal")
    VALUES (${grupoId}, ${deportistaId}, ${esPrincipal})
    ON CONFLICT ("id_grupo_familiar", "id_deportista") DO NOTHING
  `;
}

async function getBaseRefs() {
  let disciplina = await prisma.disciplina.findFirst({
    where: { activa: true },
    orderBy: { id: 'asc' },
  });

  if (!disciplina) {
    disciplina = await prisma.disciplina.create({
      data: {
        nombre: 'Futbol',
        precioMensual: 10000,
        activa: true,
      },
    });
    console.log('✅ Disciplina base creada (Futbol).');
  }

  const genero = await prisma.genero.findFirst({ orderBy: { id: 'asc' } });
  const categoria = await prisma.categoria.findFirst({ orderBy: { id: 'asc' } });

  if (!genero || !categoria) {
    throw new Error('Faltan géneros o categorías en la base. Ejecutá las migraciones primero.');
  }

  return { disciplina, genero, categoria };
}

async function ensureDeportista(
  dni: string,
  password: string,
  nombre: string,
  apellido: string,
  fechaNac: Date
): Promise<number> {
  const existing = await prisma.deportista.findUnique({ where: { dni } });
  const hashedPassword = await bcrypt.hash(password, 10);

  if (existing) {
    await prisma.cuentaUsuario.update({
      where: { id: existing.cuentaId },
      data: {
        password: hashedPassword,
        rol: Rol.DEPORTISTA,
        activo: true,
        intentosFallidos: 0,
        bloqueadoHasta: null,
      },
    });
    console.log(`✅ Deportista DNI ${dni} ya existía; cuenta actualizada.`);
    return existing.id;
  }

  const { disciplina, genero, categoria } = await getBaseRefs();

  const cuenta = await prisma.cuentaUsuario.create({
    data: {
      email: `${dni}@club.com`,
      password: hashedPassword,
      rol: Rol.DEPORTISTA,
      activo: true,
    },
  });

  const deportista = await prisma.deportista.create({
    data: {
      nombre,
      apellido,
      dni,
      fechaNac,
      generoId: genero.id,
      categoriaId: categoria.id,
      estado: EstadoDeportista.AL_DIA,
      disciplinaId: disciplina.id,
      cuentaId: cuenta.id,
    },
  });

  console.log(`✅ Deportista DNI ${dni} creado.`);
  return deportista.id;
}

async function ensureGrupoFamiliar(titularId: number, hermanoId: number) {
  const existingGroups = await prisma.grupoFamiliar.findMany({
    include: { integrantes: true },
  });

  const targetIds = [titularId, hermanoId].sort((a, b) => a - b);

  for (const group of existingGroups) {
    const groupIds = group.integrantes.map((i) => i.deportistaId).sort((a, b) => a - b);
    if (
      groupIds.length === targetIds.length &&
      groupIds.every((id, index) => id === targetIds[index])
    ) {
      console.log('✅ Grupo familiar ya existía con la misma composición.');
      return;
    }
  }

  const grupo = await prisma.grupoFamiliar.create({
    data: {
      nombre: `Grupo ${DNI_TITULAR}`,
      titularDni: DNI_TITULAR,
      cuotaHermano: 8000,
    },
  });

  await insertGrupoFamiliarIntegrante(grupo.id, titularId, true);
  await insertGrupoFamiliarIntegrante(grupo.id, hermanoId, false);

  console.log('✅ Grupo familiar creado.');
}

async function main() {
  console.log('🌱 Seed deportista 45913162 + grupo familiar 46415236/45913162...');

  await ensurePrismaColumns();

  const titularId = await ensureDeportista(
    DNI_TITULAR,
    DNI_TITULAR,
    'Deportista',
    'Prueba',
    new Date('2000-01-01')
  );

  const hermanoId = await ensureDeportista(
    DNI_HERMANO,
    DNI_HERMANO,
    'Luca',
    'Familiar',
    new Date('2002-06-15')
  );

  await ensureGrupoFamiliar(titularId, hermanoId);

  console.log('');
  console.log('Credenciales:');
  console.log(`   Titular  DNI: ${DNI_TITULAR} | Contraseña: ${DNI_TITULAR}`);
  console.log(`   Hermano  DNI: ${DNI_HERMANO} | Contraseña: ${DNI_HERMANO}`);
}

main()
  .catch((error) => {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
