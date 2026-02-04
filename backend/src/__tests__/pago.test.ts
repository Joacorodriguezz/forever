import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { prismaMock } from './mocks/prisma.mock';
import { Rol, EstadoCuota, EstadoPago, EstadoDeportista } from '@prisma/client';

describe('Pago Module', () => {
  const adminToken = jwt.sign(
    { id: 1, email: 'admin@test.com', rol: Rol.ADMINISTRATIVO },
    process.env.JWT_SECRET!
  );

  const deportistaToken = jwt.sign(
    { id: 2, email: 'deportista@test.com', rol: Rol.DEPORTISTA },
    process.env.JWT_SECRET!
  );

  beforeEach(() => {
    prismaMock.cuentaUsuario.findUnique.mockResolvedValue({
      id: 2,
      email: 'deportista@test.com',
      password: 'hashed',
      rol: Rol.DEPORTISTA,
      activo: true,
      intentosFallidos: 0,
      bloqueadoHasta: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
  });

  describe('POST /api/pagos/crear', () => {
    const pagoData = {
      cuotaId: 1,
      medioPago: 'Mercado Pago',
    };

    it('deberia retornar 401 sin token', async () => {
      const response = await request(app)
        .post('/api/pagos/crear')
        .send(pagoData);

      expect(response.status).toBe(401);
    });

    it('deberia retornar 403 si no es Deportista', async () => {
      prismaMock.cuentaUsuario.findUnique.mockResolvedValue({
        id: 1,
        email: 'admin@test.com',
        password: 'hashed',
        rol: Rol.ADMINISTRATIVO,
        activo: true,
        intentosFallidos: 0,
        bloqueadoHasta: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const response = await request(app)
        .post('/api/pagos/crear')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(pagoData);

      expect(response.status).toBe(403);
    });

    it('deberia retornar 400 si falta cuotaId', async () => {
      const response = await request(app)
        .post('/api/pagos/crear')
        .set('Authorization', `Bearer ${deportistaToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('deberia retornar 404 si la cuota no existe', async () => {
      prismaMock.deportista.findUnique.mockResolvedValue({
        id: 1,
        cuentaId: 2,
      } as any);
      prismaMock.cuota.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/pagos/crear')
        .set('Authorization', `Bearer ${deportistaToken}`)
        .send(pagoData);

      expect(response.status).toBe(404);
    });

    it('deberia retornar 400 si la cuota ya esta pagada', async () => {
      prismaMock.deportista.findUnique.mockResolvedValue({
        id: 1,
        cuentaId: 2,
      } as any);
      prismaMock.cuota.findUnique.mockResolvedValue({
        id: 1,
        deportistaId: 1,
        estadoCuota: EstadoCuota.PAGADA,
      } as any);

      const response = await request(app)
        .post('/api/pagos/crear')
        .set('Authorization', `Bearer ${deportistaToken}`)
        .send(pagoData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('pagada');
    });

    it('deberia retornar 201 al crear pago', async () => {
      prismaMock.deportista.findUnique.mockResolvedValue({
        id: 1,
        cuentaId: 2,
      } as any);
      prismaMock.cuota.findUnique.mockResolvedValue({
        id: 1,
        deportistaId: 1,
        monto: 5000,
        estadoCuota: EstadoCuota.PENDIENTE,
        deportista: { id: 1 },
      } as any);
      prismaMock.pago.create.mockResolvedValue({
        id: 1,
        fechaPago: new Date(),
        monto: 5000,
        estadoPago: EstadoPago.PENDIENTE,
        medioPago: 'Mercado Pago',
        cuota: { nroCuota: 1, disciplina: { nombre: 'Futbol' } },
      } as any);

      const response = await request(app)
        .post('/api/pagos/crear')
        .set('Authorization', `Bearer ${deportistaToken}`)
        .send(pagoData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/pagos/webhook', () => {
    it('deberia procesar webhook de Mercado Pago', async () => {
      prismaMock.pago.findUnique.mockResolvedValue({
        id: 1,
        mercadoPagoId: 'MP123',
        cuotaId: 1,
        deportistaId: 1,
        cuota: { id: 1 },
      } as any);

      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        return callback({
          pago: { update: jest.fn().mockResolvedValue({}) },
          cuota: { update: jest.fn().mockResolvedValue({}) },
          deportista: { update: jest.fn().mockResolvedValue({}) },
        });
      });

      prismaMock.cuota.count.mockResolvedValue(0);

      const response = await request(app)
        .post('/api/pagos/webhook')
        .send({
          type: 'payment',
          data: { id: 'MP123' },
        });

      expect(response.status).toBe(200);
      expect(response.body.data.received).toBe(true);
    });
  });

  describe('GET /api/pagos/:id', () => {
    beforeEach(() => {
      prismaMock.cuentaUsuario.findUnique.mockResolvedValue({
        id: 1,
        email: 'admin@test.com',
        password: 'hashed',
        rol: Rol.ADMINISTRATIVO,
        activo: true,
        intentosFallidos: 0,
        bloqueadoHasta: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
    });

    it('deberia retornar pago por ID', async () => {
      prismaMock.pago.findUnique.mockResolvedValue({
        id: 1,
        fechaPago: new Date(),
        monto: 5000,
        estadoPago: EstadoPago.APROBADO,
        cuota: { nroCuota: 1, disciplina: { nombre: 'Futbol' } },
        deportista: { nombre: 'Juan' },
      } as any);

      const response = await request(app)
        .get('/api/pagos/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.monto).toBe(5000);
    });

    it('deberia retornar 404 si no existe', async () => {
      prismaMock.pago.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/pagos/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/pagos/mis-pagos', () => {
    it('deberia retornar pagos del deportista logueado', async () => {
      prismaMock.deportista.findUnique.mockResolvedValue({
        id: 1,
        cuentaId: 2,
      } as any);
      prismaMock.pago.findMany.mockResolvedValue([
        {
          id: 1,
          fechaPago: new Date(),
          monto: 5000,
          estadoPago: EstadoPago.APROBADO,
          cuota: { nroCuota: 1, disciplina: { nombre: 'Futbol' } },
        },
      ] as any);
      prismaMock.pago.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/pagos/mis-pagos')
        .set('Authorization', `Bearer ${deportistaToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.data).toHaveLength(1);
    });
  });

  describe('POST /api/pagos/:id/confirmar', () => {
    beforeEach(() => {
      prismaMock.cuentaUsuario.findUnique.mockResolvedValue({
        id: 1,
        email: 'admin@test.com',
        password: 'hashed',
        rol: Rol.ADMINISTRATIVO,
        activo: true,
        intentosFallidos: 0,
        bloqueadoHasta: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
    });

    it('deberia confirmar pago manualmente', async () => {
      prismaMock.pago.findUnique.mockResolvedValue({
        id: 1,
        cuotaId: 1,
        deportistaId: 1,
        cuota: { id: 1 },
      } as any);

      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        return callback({
          pago: { update: jest.fn().mockResolvedValue({}) },
          cuota: { update: jest.fn().mockResolvedValue({}) },
          deportista: { update: jest.fn().mockResolvedValue({}) },
        });
      });

      prismaMock.cuota.count.mockResolvedValue(0);

      prismaMock.pago.findUnique.mockResolvedValue({
        id: 1,
        estadoPago: EstadoPago.APROBADO,
        cuota: { disciplina: { nombre: 'Futbol' } },
        deportista: { nombre: 'Juan' },
      } as any);

      const response = await request(app)
        .post('/api/pagos/1/confirmar')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ mercadoPagoId: 'MP123', status: 'approved' });

      expect(response.status).toBe(200);
    });
  });
});
