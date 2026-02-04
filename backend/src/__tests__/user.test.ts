import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { Rol } from '@prisma/client';

// Mock prisma
jest.mock('../config/prisma', () => {
  const mockPrisma = {
    cuentaUsuario: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    auditoriaCambios: {
      create: jest.fn(),
    },
  };
  return { __esModule: true, default: mockPrisma, prisma: mockPrisma };
});

import prisma from '../config/prisma';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('User Module', () => {
  const adminUser = {
    id: 1,
    email: 'admin@test.com',
    password: 'hashed',
    rol: Rol.ADMIN,
    activo: true,
    intentosFallidos: 0,
    bloqueadoHasta: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const deportistaUser = {
    id: 2,
    email: 'deportista@test.com',
    password: 'hashed',
    rol: Rol.DEPORTISTA,
    activo: true,
    intentosFallidos: 0,
    bloqueadoHasta: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const adminToken = jwt.sign(
    { id: 1, email: 'admin@test.com', rol: Rol.ADMIN },
    process.env.JWT_SECRET!
  );

  const deportistaToken = jwt.sign(
    { id: 2, email: 'deportista@test.com', rol: Rol.DEPORTISTA },
    process.env.JWT_SECRET!
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('deberia retornar 401 si no hay token', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(401);
    });

    it('deberia retornar 403 si no es Admin', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(deportistaUser);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${deportistaToken}`);

      expect(response.status).toBe(403);
    });

    it('deberia retornar 200 con lista de usuarios para Admin', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(adminUser);
      (mockPrisma.cuentaUsuario.findMany as jest.Mock).mockResolvedValue([
        { ...adminUser, deportista: null, administrativo: null },
        { ...deportistaUser, deportista: null, administrativo: null },
      ]);
      (mockPrisma.cuentaUsuario.count as jest.Mock).mockResolvedValue(2);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toHaveLength(2);
    });
  });

  describe('GET /api/users/profile', () => {
    it('deberia retornar 200 con perfil del usuario', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue({
        ...adminUser,
        deportista: null,
        administrativo: { nombre: 'Admin', apellido: 'Test' },
      });

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('admin@test.com');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('deberia retornar 400 si el email es invalido', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(adminUser);

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
    });

    it('deberia retornar 200 al actualizar perfil', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock)
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(null);
      (mockPrisma.cuentaUsuario.update as jest.Mock).mockResolvedValue({
        ...adminUser,
        email: 'newemail@test.com',
      });
      (mockPrisma.auditoriaCambios.create as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'newemail@test.com' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/users/:id/role', () => {
    it('deberia retornar 400 si el rol es invalido', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(adminUser);

      const response = await request(app)
        .put('/api/users/2/role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ rol: 'INVALID_ROL' });

      expect(response.status).toBe(400);
    });

    it('deberia retornar 403 si no es Admin', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock).mockResolvedValue(deportistaUser);

      const response = await request(app)
        .put('/api/users/3/role')
        .set('Authorization', `Bearer ${deportistaToken}`)
        .send({ rol: 'ADMINISTRATIVO' });

      expect(response.status).toBe(403);
    });

    it('deberia retornar 200 al cambiar rol', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock)
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(deportistaUser);
      (mockPrisma.cuentaUsuario.count as jest.Mock).mockResolvedValue(2);
      (mockPrisma.cuentaUsuario.update as jest.Mock).mockResolvedValue({
        ...deportistaUser,
        rol: Rol.ADMINISTRATIVO,
      });
      (mockPrisma.auditoriaCambios.create as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .put('/api/users/2/role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ rol: 'ADMINISTRATIVO' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('deberia retornar 400 si es el ultimo Admin', async () => {
      (mockPrisma.cuentaUsuario.findUnique as jest.Mock)
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(adminUser);
      (mockPrisma.cuentaUsuario.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app)
        .put('/api/users/1/role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ rol: 'DEPORTISTA' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('al menos un Administrador');
    });
  });
});
