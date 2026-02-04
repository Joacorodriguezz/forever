import { PrismaClient, Rol, EstadoDeportista, EstadoCuota, EstadoPago, Periodicidad, Vinculo } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de datos...');

    // Limpiar datos existentes (opcional)
    await prisma.auditoriaCambios.deleteMany();
    await prisma.auditoriaAcceso.deleteMany();
    await prisma.pago.deleteMany();
    await prisma.cuota.deleteMany();
    await prisma.grupoFamiliarIntegrante.deleteMany();
    await prisma.grupoFamiliar.deleteMany();
    await prisma.deportista.deleteMany();
    await prisma.administrativo.deleteMany();
    await prisma.cuentaUsuario.deleteMany();
    await prisma.domicilio.deleteMany();
    await prisma.localidad.deleteMany();
    await prisma.disciplina.deleteMany();

    console.log('✅ Datos antiguos eliminados');

    // 1. Crear Localidades
    const localidad1 = await prisma.localidad.create({
        data: {
            codigoPostal: '5000',
            nombre: 'Córdoba Capital',
        },
    });

    const localidad2 = await prisma.localidad.create({
        data: {
            codigoPostal: '5001',
            nombre: 'Villa Carlos Paz',
        },
    });

    console.log('✅ Localidades creadas');

    // 2. Crear Disciplinas
    const futbol = await prisma.disciplina.create({
        data: {
            nombre: 'Fútbol',
            descripcion: 'Entrenamiento de fútbol para todas las edades',
            precioMensual: 15000,
            activa: true,
        },
    });

    const natacion = await prisma.disciplina.create({
        data: {
            nombre: 'Natación',
            descripcion: 'Clases de natación en pileta climatizada',
            precioMensual: 18000,
            activa: true,
        },
    });

    const tenis = await prisma.disciplina.create({
        data: {
            nombre: 'Tenis',
            descripcion: 'Clases de tenis para principiantes y avanzados',
            precioMensual: 20000,
            activa: true,
        },
    });

    console.log('✅ Disciplinas creadas');

    // 3. Crear Cuentas de Usuario y Administrativos
    const hashedPassword = await bcrypt.hash('Admin123', 10);

    const adminCuenta = await prisma.cuentaUsuario.create({
        data: {
            email: 'admin@club.com',
            password: hashedPassword,
            rol: Rol.ADMIN,
            activo: true,
        },
    });

    await prisma.administrativo.create({
        data: {
            nombre: 'Carlos',
            apellido: 'Gómez',
            dni: '30123456',
            cuentaId: adminCuenta.id,
        },
    });

    const administrativoCuenta = await prisma.cuentaUsuario.create({
        data: {
            email: 'secretaria@club.com',
            password: hashedPassword,
            rol: Rol.ADMINISTRATIVO,
            activo: true,
        },
    });

    await prisma.administrativo.create({
        data: {
            nombre: 'María',
            apellido: 'Rodríguez',
            dni: '31234567',
            cuentaId: administrativoCuenta.id,
        },
    });

    console.log('✅ Administrativos creados');

    // 4. Crear Deportistas
    const domicilio1 = await prisma.domicilio.create({
        data: {
            calle: 'Av. Colón',
            numero: '1234',
            piso: '5',
            departamento: 'A',
            localidadId: localidad1.id,
        },
    });

    const deportista1Cuenta = await prisma.cuentaUsuario.create({
        data: {
            email: 'juan.perez@mail.com',
            password: await bcrypt.hash('Juan1234', 10),
            rol: Rol.DEPORTISTA,
            activo: true,
        },
    });

    const deportista1 = await prisma.deportista.create({
        data: {
            nombre: 'Juan',
            apellido: 'Pérez',
            dni: '40123456',
            fechaNac: new Date('2005-03-15'),
            categoria: 'Juvenil',
            obraSocial: 'OSDE',
            estado: EstadoDeportista.AL_DIA,
            disciplinaId: futbol.id,
            cuentaId: deportista1Cuenta.id,
            domicilioId: domicilio1.id,
            telefonos: '351-1234567, 351-7654321',
            enfermedades: 'Asma leve',
        },
    });

    const domicilio2 = await prisma.domicilio.create({
        data: {
            calle: 'San Martín',
            numero: '567',
            localidadId: localidad1.id,
        },
    });

    const deportista2Cuenta = await prisma.cuentaUsuario.create({
        data: {
            email: 'maria.lopez@mail.com',
            password: await bcrypt.hash('Maria1234', 10),
            rol: Rol.DEPORTISTA,
            activo: true,
        },
    });

    const deportista2 = await prisma.deportista.create({
        data: {
            nombre: 'María',
            apellido: 'López',
            dni: '41234567',
            fechaNac: new Date('2008-07-20'),
            categoria: 'Infantil',
            obraSocial: 'Swiss Medical',
            estado: EstadoDeportista.AL_DIA,
            disciplinaId: natacion.id,
            cuentaId: deportista2Cuenta.id,
            domicilioId: domicilio2.id,
            telefonos: '351-9876543',
            enfermedades: null,
        },
    });

    const domicilio3 = await prisma.domicilio.create({
        data: {
            calle: 'Belgrano',
            numero: '890',
            piso: '2',
            departamento: 'B',
            localidadId: localidad2.id,
        },
    });

    const deportista3Cuenta = await prisma.cuentaUsuario.create({
        data: {
            email: 'pedro.gonzalez@mail.com',
            password: await bcrypt.hash('Pedro1234', 10),
            rol: Rol.DEPORTISTA,
            activo: true,
        },
    });

    const deportista3 = await prisma.deportista.create({
        data: {
            nombre: 'Pedro',
            apellido: 'González',
            dni: '39876543',
            fechaNac: new Date('2003-11-10'),
            categoria: 'Mayor',
            obraSocial: null,
            estado: EstadoDeportista.EN_DEUDA,
            disciplinaId: tenis.id,
            cuentaId: deportista3Cuenta.id,
            domicilioId: domicilio3.id,
            telefonos: '351-5555555, 351-4444444',
            enfermedades: 'Diabetes tipo 1, Alergia al sol',
        },
    });

    const domicilio4 = await prisma.domicilio.create({
        data: {
            calle: 'Rivadavia',
            numero: '2100',
            localidadId: localidad1.id,
        },
    });

    const deportista4Cuenta = await prisma.cuentaUsuario.create({
        data: {
            email: 'ana.martinez@mail.com',
            password: await bcrypt.hash('Ana12345', 10),
            rol: Rol.DEPORTISTA,
            activo: false,
        },
    });

    const deportista4 = await prisma.deportista.create({
        data: {
            nombre: 'Ana',
            apellido: 'Martínez',
            dni: '42345678',
            fechaNac: new Date('2010-05-25'),
            categoria: 'Infantil',
            obraSocial: 'Medife',
            estado: EstadoDeportista.INACTIVA,
            disciplinaId: futbol.id,
            cuentaId: deportista4Cuenta.id,
            domicilioId: domicilio4.id,
            telefonos: '351-3333333',
            enfermedades: null,
        },
    });

    console.log('✅ Deportistas creados');

    // 5. Crear Grupo Familiar
    const grupoFamiliar1 = await prisma.grupoFamiliar.create({
        data: {
            nombre: 'Familia Pérez',
        },
    });

    await prisma.grupoFamiliarIntegrante.create({
        data: {
            grupoId: grupoFamiliar1.id,
            deportistaId: deportista1.id,
            vinculo: Vinculo.HIJO,
            esPrincipal: true,
        },
    });

    console.log('✅ Grupos familiares creados');

    // 6. Crear Cuotas
    const cuota1 = await prisma.cuota.create({
        data: {
            nroCuota: 1,
            monto: futbol.precioMensual,
            fechaEmision: new Date('2026-01-01'),
            fechaVencimiento: new Date('2026-01-10'),
            estadoCuota: EstadoCuota.PAGADA,
            periodicidad: Periodicidad.MENSUAL,
            disciplinaId: futbol.id,
            deportistaId: deportista1.id,
        },
    });

    const cuota2 = await prisma.cuota.create({
        data: {
            nroCuota: 2,
            monto: futbol.precioMensual,
            fechaEmision: new Date('2026-02-01'),
            fechaVencimiento: new Date('2026-02-10'),
            estadoCuota: EstadoCuota.PENDIENTE,
            periodicidad: Periodicidad.MENSUAL,
            disciplinaId: futbol.id,
            deportistaId: deportista1.id,
        },
    });

    const cuota3 = await prisma.cuota.create({
        data: {
            nroCuota: 1,
            monto: natacion.precioMensual,
            fechaEmision: new Date('2026-01-01'),
            fechaVencimiento: new Date('2026-01-10'),
            estadoCuota: EstadoCuota.PAGADA,
            periodicidad: Periodicidad.MENSUAL,
            disciplinaId: natacion.id,
            deportistaId: deportista2.id,
        },
    });

    const cuota4 = await prisma.cuota.create({
        data: {
            nroCuota: 1,
            monto: tenis.precioMensual,
            fechaEmision: new Date('2025-12-01'),
            fechaVencimiento: new Date('2025-12-10'),
            estadoCuota: EstadoCuota.VENCIDA,
            periodicidad: Periodicidad.MENSUAL,
            disciplinaId: tenis.id,
            deportistaId: deportista3.id,
        },
    });

    const cuota5 = await prisma.cuota.create({
        data: {
            nroCuota: 2,
            monto: tenis.precioMensual,
            fechaEmision: new Date('2026-01-01'),
            fechaVencimiento: new Date('2026-01-10'),
            estadoCuota: EstadoCuota.VENCIDA,
            periodicidad: Periodicidad.MENSUAL,
            disciplinaId: tenis.id,
            deportistaId: deportista3.id,
        },
    });

    console.log('✅ Cuotas creadas');

    // 7. Crear Pagos
    await prisma.pago.create({
        data: {
            fechaPago: new Date('2026-01-05'),
            monto: futbol.precioMensual,
            estadoPago: EstadoPago.APROBADO,
            medioPago: 'Transferencia',
            cuotaId: cuota1.id,
            deportistaId: deportista1.id,
        },
    });

    await prisma.pago.create({
        data: {
            fechaPago: new Date('2026-01-08'),
            monto: natacion.precioMensual,
            estadoPago: EstadoPago.APROBADO,
            medioPago: 'Efectivo',
            cuotaId: cuota3.id,
            deportistaId: deportista2.id,
        },
    });

    await prisma.pago.create({
        data: {
            fechaPago: new Date('2026-02-03'),
            monto: futbol.precioMensual,
            estadoPago: EstadoPago.PENDIENTE,
            medioPago: 'MercadoPago',
            mercadoPagoId: 'MP123456789',
            mercadoPagoStatus: 'pending',
            cuotaId: cuota2.id,
            deportistaId: deportista1.id,
        },
    });

    console.log('✅ Pagos creados');

    console.log('🎉 Seed completado exitosamente!');
    console.log('');
    console.log('📝 Credenciales de acceso:');
    console.log('');
    console.log('👤 Admin:');
    console.log('   Email: admin@club.com');
    console.log('   Password: Admin123');
    console.log('');
    console.log('👤 Administrativo:');
    console.log('   Email: secretaria@club.com');
    console.log('   Password: Admin123');
    console.log('');
    console.log('👤 Deportistas:');
    console.log('   Email: juan.perez@mail.com | Password: Juan1234');
    console.log('   Email: maria.lopez@mail.com | Password: Maria1234');
    console.log('   Email: pedro.gonzalez@mail.com | Password: Pedro1234');
    console.log('   Email: ana.martinez@mail.com | Password: Ana12345');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
