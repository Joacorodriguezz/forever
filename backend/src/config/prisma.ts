import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Desactivar prepared statements para evitar el error "prepared statement already exists"
    // Esto puede ocurrir con tsx watch y hot reload
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Cerrar la conexión al terminar el proceso
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
