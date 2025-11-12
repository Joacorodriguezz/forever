import { PrismaClient, $Enums } from '@prisma/client';
import bcrypt from 'bcrypt';

// Yo lo que haría es permitir que existan varios administradores,
// es decir, que no se degrade a los demás ADMIN a ADMINISTRATIVO,
// sino que simplemente se cree un nuevo administrador si no existe.
// Esto permitiría crear más admins en el futuro si se necesitara.
// De todos modos, dejo el código original tal como está y abajo dejo como lo cambiaria yo.

// const prisma = new PrismaClient();

// const ADMIN_EMAIL = 'milimartilutomivalen@gmail.com';
// const ADMIN_PASSWORD_TEMPORAL = 'administrador123';
// const ROL_ADMIN = 'ADMIN';
// const ROL_DEFAULT = 'ADMINISTRATIVO';

// async function crearOSetearUnicoAdmin() {
//   try {
//     //hasheo la contraseña
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD_TEMPORAL, salt);
//     const adminUser = await prisma.$transaction(async (tx:any) => {
//       //pongo a todos los admin como administrativos
//       const { count: demotedCount } = await tx.usuario.updateMany({
//         where: { rol: ROL_ADMIN },
//         data: { rol: ROL_DEFAULT },
//       });

//       if (demotedCount > 0) {
//         console.log(`- ${demotedCount} administrador(es) previos han sido degradados a ${ROL_DEFAULT}.`);
//       }

//       // crear al usuario si no existe, o actualizarlo si ya existe.
//       const user = await tx.usuario.upsert({
//         where: { email: ADMIN_EMAIL },
//         // si el usuario ya existe, solo nos aseguramos de que tenga el rol de ADMIN.
//         update: {
//           rol: ROL_ADMIN,
//         },
//         // Si el usuario NO existe, lo crea con los datos especificados.
//         create: {
//           email: ADMIN_EMAIL,
//           password: hashedPassword,
//           rol: ROL_ADMIN,
//         },
//       });

//       return user;
//     });



//   } catch (error) {
//     console.error('\n❌ Error durante el proceso:', error instanceof Error ? error.message : error);
//     process.exit(1);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// crearOSetearUnicoAdmin();

//  este seria el codigo para que no degrade a los demas admin a administrativo. hable con mili y concidimos que es mejor asi.
const prisma = new PrismaClient();

const ADMIN_EMAIL = 'administrador1@admin.com'; // en caso de que se quiera crear otro admin, cambiar este email y contraseña
const ADMIN_PASSWORD = 'administrador123';

async function crearAdmin() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const admin = await prisma.usuario.upsert({
      where: { email: ADMIN_EMAIL },
      update: {}, // si ya existe, no cambia nada
      create: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        rol: 'ADMIN',
      },
    });

    console.log('✅ Usuario administrador creado o existente:');
    console.log(`Email: ${admin.email}`);
    console.log(`Rol: ${admin.rol}`);
  } catch (error) {
    console.error('❌ Error al crear administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

crearAdmin();
// para ejecutar este script: docker-compose exec backend npx ts-node src/scripts/unicoAdmin.ts