import { PrismaClient } from '@prisma/client';
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';

const prisma = new PrismaClient();

describe('Seed Database - Insertar datos en todas las tablas', () => {

  beforeAll(async () => {
    // Limpiar todas las tablas en orden inverso de dependencias
    await prisma.comprobante.deleteMany();
    await prisma.pago.deleteMany();
    await prisma.cuota.deleteMany();
    await prisma.grupoFamiliarMiembro.deleteMany();
    await prisma.grupoFamiliar.deleteMany();
    await prisma.deportistaTelefono.deleteMany();
    await prisma.deportistaEnfermedad.deleteMany();
    await prisma.deportistaDisciplina.deleteMany();
    await prisma.deportista.deleteMany();
    await prisma.administrativo.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.domicilio.deleteMany();
    await prisma.disciplina.deleteMany();
    await prisma.telefono.deleteMany();
    await prisma.enfermedad.deleteMany();
    await prisma.localidad.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Variables para guardar IDs creados
  let localidadId: number;
  let domicilioId: number;
  let enfermedadId: number;
  let telefonoId: number;
  let disciplinaId: number;
  let usuarioDeportistaId: number;
  let usuarioAdminId: number;
  let deportistaId: number;
  let deportista2Id: number;
  let administrativoId: number;
  let grupoFamiliarId: number;
  let cuotaId: number;
  let pagoId: number;

  test('1. Crear Localidad', async () => {
    const localidad = await prisma.localidad.create({
      data: {
        codigoPostal: 1900,
        nombre: 'La Plata'
      }
    });
    localidadId = localidad.id;
    expect(localidad.nombre).toBe('La Plata');
    console.log('✅ Localidad creada:', localidad);
  });

  test('2. Crear Enfermedad', async () => {
    const enfermedad = await prisma.enfermedad.create({
      data: {
        nombre: 'Asma'
      }
    });
    enfermedadId = enfermedad.id;
    expect(enfermedad.nombre).toBe('Asma');
    console.log('✅ Enfermedad creada:', enfermedad);
  });

  test('3. Crear Telefono', async () => {
    const telefono = await prisma.telefono.create({
      data: {
        numero: '221-555-1234'
      }
    });
    telefonoId = telefono.id;
    expect(telefono.numero).toBe('221-555-1234');
    console.log('✅ Telefono creado:', telefono);
  });

  test('4. Crear Disciplina', async () => {
    const disciplina = await prisma.disciplina.create({
      data: {
        nombre: 'Fútbol',
        precioMensual: 15000.00
      }
    });
    disciplinaId = disciplina.id;
    expect(disciplina.nombre).toBe('Fútbol');
    console.log('✅ Disciplina creada:', disciplina);
  });

  test('5. Crear Domicilio', async () => {
    const domicilio = await prisma.domicilio.create({
      data: {
        calle: 'Calle 50',
        numero: 1234,
        id_localidad: localidadId
      }
    });
    domicilioId = domicilio.id;
    expect(domicilio.calle).toBe('Calle 50');
    console.log('✅ Domicilio creado:', domicilio);
  });

  test('6. Crear Usuario (para Deportista)', async () => {
    const usuario = await prisma.usuario.create({
      data: {
        email: 'deportista@test.com',
        password: '$2b$10$hashedpassword123456789012345678901234',
        rol: 'SOCIO'
      }
    });
    usuarioDeportistaId = usuario.id;
    expect(usuario.email).toBe('deportista@test.com');
    console.log('✅ Usuario Deportista creado:', usuario);
  });

  test('7. Crear Usuario (para Admin)', async () => {
    const usuario = await prisma.usuario.create({
      data: {
        email: 'admin@test.com',
        password: '$2b$10$hashedpassword123456789012345678901234',
        rol: 'ADMIN'
      }
    });
    usuarioAdminId = usuario.id;
    expect(usuario.email).toBe('admin@test.com');
    console.log('✅ Usuario Admin creado:', usuario);
  });

  test('8. Crear Administrativo', async () => {
    const administrativo = await prisma.administrativo.create({
      data: {
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: 30123456,
        activo: true,
        usuarioId: usuarioAdminId
      }
    });
    administrativoId = administrativo.id;
    expect(administrativo.nombre).toBe('Juan');
    console.log('✅ Administrativo creado:', administrativo);
  });

  test('9. Crear Deportista principal', async () => {
    const deportista = await prisma.deportista.create({
      data: {
        nombre: 'Carlos',
        apellido: 'González',
        dni: 40123456,
        estado: 'AL_DIA',
        categoria: 'Primera',
        fechaNacimiento: new Date('1995-05-15'),
        obraSocial: 'OSDE',
        sexo: 'MASCULINO',
        pais: 'ARGENTINA',
        id_cuenta: usuarioDeportistaId,
        id_domicilio: domicilioId,
        id_disciplina: disciplinaId
      }
    });
    deportistaId = deportista.id;
    expect(deportista.nombre).toBe('Carlos');
    console.log('✅ Deportista creado:', deportista);
  });

  test('10. Crear segundo Usuario y Deportista (para grupo familiar)', async () => {
    const usuario2 = await prisma.usuario.create({
      data: {
        email: 'deportista2@test.com',
        password: '$2b$10$hashedpassword123456789012345678901234',
        rol: 'SOCIO'
      }
    });

    const deportista2 = await prisma.deportista.create({
      data: {
        nombre: 'María',
        apellido: 'González',
        dni: 45123456,
        estado: 'AL_DIA',
        fechaNacimiento: new Date('2010-08-20'),
        sexo: 'FEMENINO',
        pais: 'ARGENTINA',
        id_cuenta: usuario2.id,
        adultoResponsableId: deportistaId
      }
    });
    deportista2Id = deportista2.id;
    expect(deportista2.nombre).toBe('María');
    console.log('✅ Deportista 2 creado:', deportista2);
  });

  test('11. Crear DeportistaDisciplina (relación M:M)', async () => {
    const deportistaDisciplina = await prisma.deportistaDisciplina.create({
      data: {
        deportistaId: deportistaId,
        disciplinaId: disciplinaId
      }
    });
    expect(deportistaDisciplina.deportistaId).toBe(deportistaId);
    console.log('✅ DeportistaDisciplina creada:', deportistaDisciplina);
  });

  test('12. Crear DeportistaEnfermedad (relación M:M)', async () => {
    const deportistaEnfermedad = await prisma.deportistaEnfermedad.create({
      data: {
        deportistaId: deportistaId,
        enfermedadId: enfermedadId
      }
    });
    expect(deportistaEnfermedad.deportistaId).toBe(deportistaId);
    console.log('✅ DeportistaEnfermedad creada:', deportistaEnfermedad);
  });

  test('13. Crear DeportistaTelefono (relación M:M)', async () => {
    const deportistaTelefono = await prisma.deportistaTelefono.create({
      data: {
        deportistaId: deportistaId,
        telefonoId: telefonoId
      }
    });
    expect(deportistaTelefono.deportistaId).toBe(deportistaId);
    console.log('✅ DeportistaTelefono creado:', deportistaTelefono);
  });

  test('14. Crear GrupoFamiliar', async () => {
    const grupoFamiliar = await prisma.grupoFamiliar.create({
      data: {
        nombre: 'Familia González',
        deportistaPrincipalId: deportistaId
      }
    });
    grupoFamiliarId = grupoFamiliar.id;
    expect(grupoFamiliar.nombre).toBe('Familia González');
    console.log('✅ GrupoFamiliar creado:', grupoFamiliar);
  });

  test('15. Crear GrupoFamiliarMiembro', async () => {
    const miembro = await prisma.grupoFamiliarMiembro.create({
      data: {
        grupoFamiliarId: grupoFamiliarId,
        deportistaId: deportista2Id,
        vinculo: 'HIJA'
      }
    });
    expect(miembro.vinculo).toBe('HIJA');
    console.log('✅ GrupoFamiliarMiembro creado:', miembro);
  });

  test('16. Crear Cuota', async () => {
    const cuota = await prisma.cuota.create({
      data: {
        monto: 15000.00,
        fechaVencimiento: new Date('2025-02-28'),
        estadoCuota: 'PENDIENTE',
        nroCuota: 1,
        mes: 'FEBRERO',
        deportista_id: deportistaId,
        id_disciplina: disciplinaId
      }
    });
    cuotaId = cuota.id;
    expect(cuota.estadoCuota).toBe('PENDIENTE');
    console.log('✅ Cuota creada:', cuota);
  });

  test('17. Crear Pago', async () => {
    const pago = await prisma.pago.create({
      data: {
        fechaPago: new Date(),
        estadoPago: 'APROBADO',
        linkComprobante: 'https://storage.example.com/comprobante.pdf',
        id_cuota: cuotaId,
        id_deportista: deportistaId
      }
    });
    pagoId = pago.id;
    expect(pago.estadoPago).toBe('APROBADO');
    console.log('✅ Pago creado:', pago);

    // Actualizar estado de la cuota
    await prisma.cuota.update({
      where: { id: cuotaId },
      data: { estadoCuota: 'PAGADA' }
    });
  });

  test('18. Crear Comprobante', async () => {
    const comprobante = await prisma.comprobante.create({
      data: {
        cuotaId: cuotaId,
        url: 'https://storage.supabase.com/comprobantes/comp001.pdf',
        activo: true
      }
    });
    expect(comprobante.activo).toBe(true);
    console.log('✅ Comprobante creado:', comprobante);
  });

  test('19. Verificar todas las tablas tienen datos', async () => {
    const counts = {
      localidades: await prisma.localidad.count(),
      domicilios: await prisma.domicilio.count(),
      enfermedades: await prisma.enfermedad.count(),
      telefonos: await prisma.telefono.count(),
      disciplinas: await prisma.disciplina.count(),
      usuarios: await prisma.usuario.count(),
      administrativos: await prisma.administrativo.count(),
      deportistas: await prisma.deportista.count(),
      deportistaDisciplinas: await prisma.deportistaDisciplina.count(),
      deportistaEnfermedades: await prisma.deportistaEnfermedad.count(),
      deportistaTelefonos: await prisma.deportistaTelefono.count(),
      gruposFamiliares: await prisma.grupoFamiliar.count(),
      grupoFamiliarMiembros: await prisma.grupoFamiliarMiembro.count(),
      cuotas: await prisma.cuota.count(),
      pagos: await prisma.pago.count(),
      comprobantes: await prisma.comprobante.count()
    };

    console.log('\n📊 RESUMEN DE DATOS INSERTADOS:');
    console.log('================================');
    Object.entries(counts).forEach(([tabla, count]) => {
      console.log(`  ${tabla}: ${count} registro(s)`);
    });

    // Verificar que todas las tablas tienen al menos 1 registro
    Object.values(counts).forEach(count => {
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });
});
