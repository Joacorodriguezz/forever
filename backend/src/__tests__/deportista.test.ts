import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { Rol, EstadoDeportista, EstadoCuota } from '@prisma/client';

// Mock prisma
jest.mock('../config/prisma', () => {
  const mockPrisma = {
    cuentaUsuario: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    deportista: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    domicilio: {
      create: jest.fn(),
      update: jest.fn(),
    },
    telefono: {
      create: jest.fn(),
    },
    deportistaTelefono: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    deportistaEnfermedad: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    pago: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  return { __esModule: true, default: mockPrisma, prisma: mockPrisma };
});

import prisma from '../config/prisma';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Deportista Module', () => {
  const adminUser = {
    id: 1,
    email: 'admin@test.com',
    password: 'hashed',
    rol: Rol.ADMINISTRATIVO,
    activo: true,
    intentosFallidos: 0,
    bloqueadoHasta: null,
  };

  const deportistaUser = {
    id: 2,
    email: 'deportista@test.com',
    password: 'hashed',
    rol: Rol.DEPORTISTA,
    activo: true,
    intentosFallidos: 0,
    bloqueadoHasta: null,
  };

  const adminToken = jwt.sign(
    { id: 1, email: 'admin@test.com', rol: Rol.ADMINISTRATIVO },
    process.env.JWT_SECRET!
  );

  const deportistaToken = jwt.sign(
    { id: 2, email: 'deportista@test.com', rol: Rol.DEPORTISTA },
    process.env.JWT_SECRET!
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/deportistas', () => {
    const deportistaData = {
      nombre: 'Juan',
      apellido: 'Perez',
      dni: '12345678',
      fechaNac: '2000-01-15',
      disciplinaId: 1,
      email: 'juan@test.com',
      password: 'Password123',
      domicilio: {
        calle: 'Calle 123',
        numero: '456',
        localidadId: 1,
      },
    };

    it('deberia retornar 401 sin token', async () => {
      const response = await request(app)
        .post('/api/deportistas')
        .send(deportistaData);

      expect(response.status).toBe(401);
    });

    it('deberia retornar 403 si no es Administrativo', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(deportistaUser);

      const response = await request(app)
        .post('/api/deportistas')
        .set('Authorization', `Bearer ${deportistaToken}`)
        .send(deportistaData);

      expect(response.status).toBe(403);
    });

    it('deberia retornar 400 si faltan campos', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(adminUser);

      const response = await request(app)
        .post('/api/deportistas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Juan' });

      expect(response.status).toBe(400);
    });

    it('deberia retornar 400 si el DNI es invalido', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(adminUser);

      const response = await request(app)
        .post('/api/deportistas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...deportistaData, dni: '123' });

      expect(response.status).toBe(400);
    });

    it('deberia retornar 400 si la contrasena no tiene mayuscula', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(adminUser);

      const response = await request(app)
        .post('/api/deportistas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...deportistaData, password: 'password123' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/deportistas', () => {
    it('deberia retornar 200 con lista de deportistas', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(adminUser);
      (mockPrisma.deportista.findMany as jest.Mock).mockResolvedValue([
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Perez',
          dni: '12345678',
          estado: EstadoDeportista.AL_DIA,
          disciplina: { nombre: 'Futbol' },
          cuenta: { email: 'juan@test.com', activo: true },
        },
      ]);
      (mockPrisma.deportista.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app)
        .get('/api/deportistas')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toHaveLength(1);
    });
  });

  describe('GET /api/deportistas/:id', () => {
    it('deberia retornar 200 con deportista', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(adminUser);
      (mockPrisma.deportista.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '12345678',
        disciplina: { nombre: 'Futbol' },
        cuenta: { email: 'juan@test.com' },
        domicilio: { calle: 'Calle 123', localidad: { nombre: 'Ciudad' } },
        telefonos: [],
        enfermedades: [],
      });

      const response = await request(app)
        .get('/api/deportistas/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.nombre).toBe('Juan');
    });

    it('deberia retornar 404 si no existe', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(adminUser);
      (mockPrisma.deportista.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/deportistas/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/deportistas/pagos-pendientes', () => {
    it('deberia retornar deportistas con pagos pendientes', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(adminUser);
      (mockPrisma.deportista.findMany as jest.Mock).mockResolvedValue([
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Perez',
          dni: '12345678',
          cuotas: [
            { monto: 1000, fechaVencimiento: new Date(), estadoCuota: EstadoCuota.PENDIENTE },
            { monto: 1000, fechaVencimiento: new Date(), estadoCuota: EstadoCuota.VENCIDA },
          ],
        },
      ]);

      const response = await request(app)
        .get('/api/deportistas/pagos-pendientes')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data[0].cantidadCuotasPendientes).toBe(2);
      expect(response.body.data[0].montoTotalAdeudado).toBe(2000);
    });
  });

  describe('DELETE /api/deportistas/:id', () => {
    it('deberia retornar 200 al eliminar', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(adminUser);
      (mockPrisma.deportista.findUnique as jest.Mock).mockResolvedValue({ id: 1, nombre: 'Juan' });
      (mockPrisma.deportista.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .delete('/api/deportistas/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.message).toContain('eliminado');
    });
  });

  describe('GET /api/deportistas/mi-perfil', () => {
    it('deberia retornar perfil del deportista logueado', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(deportistaUser);
      (mockPrisma.deportista.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        cuentaId: 2,
        disciplina: { nombre: 'Futbol' },
        domicilio: { calle: 'Calle 123' },
      });

      const response = await request(app)
        .get('/api/deportistas/mi-perfil')
        .set('Authorization', `Bearer ${deportistaToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.nombre).toBe('Juan');
    });
  });
});
