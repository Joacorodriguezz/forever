import dotenv from 'dotenv';
import { PrismaClient, EstadoCuota, EstadoDeportista, Periodicidad } from '@prisma/client';

dotenv.config();

const DNI = '46415236';

const prisma = new PrismaClient();

async function main() {
  console.log(`🌱 Seed 3 cuotas en deuda para deportista DNI ${DNI}...`);

  const deportista = await prisma.deportista.findUnique({
    where: { dni: DNI },
    include: { disciplina: true },
  });

  if (!deportista) {
    throw new Error(
      `No existe deportista con DNI ${DNI}. Ejecutá primero: npm run prisma:seed:deportista-test`
    );
  }

  await prisma.pago.deleteMany({
    where: {
      deportistaId: deportista.id,
      cuota: {
        estadoCuota: { in: [EstadoCuota.PENDIENTE, EstadoCuota.VENCIDA] },
      },
    },
  });

  await prisma.cuota.deleteMany({
    where: {
      deportistaId: deportista.id,
      estadoCuota: { in: [EstadoCuota.PENDIENTE, EstadoCuota.VENCIDA] },
    },
  });

  const monto = deportista.disciplina.precioMensual;

  const cuotas = [
    {
      nroCuota: 2,
      anio: 2026,
      monto,
      fechaEmision: new Date('2026-01-01'),
      fechaVencimiento: new Date('2026-01-10'),
      estadoCuota: EstadoCuota.VENCIDA,
    },
    {
      nroCuota: 3,
      anio: 2026,
      monto,
      fechaEmision: new Date('2026-02-01'),
      fechaVencimiento: new Date('2026-02-10'),
      estadoCuota: EstadoCuota.VENCIDA,
    },
    {
      nroCuota: 4,
      anio: 2026,
      monto,
      fechaEmision: new Date('2026-03-01'),
      fechaVencimiento: new Date('2026-06-30'),
      estadoCuota: EstadoCuota.PENDIENTE,
    },
  ];

  for (const cuota of cuotas) {
    await prisma.cuota.create({
      data: {
        ...cuota,
        periodicidad: Periodicidad.MENSUAL,
        disciplinaId: deportista.disciplinaId,
        deportistaId: deportista.id,
      },
    });
  }

  await prisma.deportista.update({
    where: { id: deportista.id },
    data: { estado: EstadoDeportista.EN_DEUDA },
  });

  const total = cuotas.reduce((sum, c) => sum + Number(c.monto), 0);

  console.log('✅ 3 cuotas en deuda creadas.');
  console.log(`   Deportista: ${deportista.nombre} ${deportista.apellido} (DNI ${DNI})`);
  console.log(`   Disciplina: ${deportista.disciplina.nombre}`);
  console.log(`   Total adeudado: $${total.toLocaleString('es-AR')}`);
  console.log('   Cuotas: #2 y #3 vencidas, #4 pendiente');
}

main()
  .catch((error) => {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
