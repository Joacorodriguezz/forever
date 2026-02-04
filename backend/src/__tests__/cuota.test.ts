import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { prismaMock } from './mocks/prisma.mock';
import { Rol, EstadoCuota, Periodicidad } from '@prisma/client';

describe('Cuota Module', () => {
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

  describe('POST /api/cuotas/asignar', () => {
    const cuotaData = {
      deportistaId: 1,
      nroCuota: 1,
      monto: 5000,
      fechaEmision: '2024-01-01T00:00:00.000Z',
      fechaVencimiento: '2024-01-31T00:00:00.000Z',
      disciplinaId: 1,
    };

    it('deberia retornar 401 sin token', async () => {
      const response = await request(app)
        .post('/api/cuotas/asignar')
        .send(cuotaData);

      expect(response.status).toBe(401);
    });

    it('deberia retornar 403 si no es Administrativo', async () => {
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

      const response = await request(app)
        .post('/api/cuotas/asignar')
        .set('Authorization', `Bearer ${deportistaToken}`)
        .send(cuotaData);

      expect(response.status).toBe(403);
    });

    it('deberia retornar 400 si faltan campos', async () => {
      const response = await request(app)
        .post('/api/cuotas/asignar')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ deportistaId: 1 });

      expect(response.status).toBe(400);
    });

    it('deberia retornar 404 si el deportista no existe', async () => {
      prismaMock.deportista.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/cuotas/asignar')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(cuotaData);

      expect(response.status).toBe(404);
    });

    it('deberia retornar 409 si la cuota ya existe', async () => {
      prismaMock.deportista.findUnique.mockResolvedValue({ id: 1 } as any);
      prismaMock.cuota.findFirst.mockResolvedValue({ id: 1 } as any);

      const response = await request(app)
        .post('/api/cuotas/asignar')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(cuotaData);

      expect(response.status).toBe(409);
    });

    it('deberia retornar 201 al asignar cuota', async () => {
      prismaMock.deportista.findUnique.mockResolvedValue({ id: 1 } as any);
      prismaMock.cuota.findFirst.mockResolvedValue(null);
      prismaMock.cuota.create.mockResolvedValue({
        id: 1,
        nroCuota: 1,
        monto: 5000,
        estadoCuota: EstadoCuota.PENDIENTE,
        disciplina: { nombre: 'Futbol' },
        deportista: { nombre: 'Juan' },
      } as any);

      const response = await request(app)
        .post('/api/cuotas/asignar')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(cuotaData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/cuotas/predefinidas', () => {
    it('deberia retornar lista de cuotas predefinidas', async () => {
      prismaMock.disciplina.findMany.mockResolvedValue([
        { id: 1, nombre: 'Futbol', precioMensual: 5000 },
        { id: 2, nombre: 'Basquet', precioMensual: 4500 },
      ] as any);

      const response = await request(app)
        .get('/api/cuotas/predefinidas')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/cuotas/:id', () => {
    it('deberia retornar cuota por ID', async () => {
      prismaMock.cuota.findUnique.mockResolvedValue({
        id: 1,
        nroCuota: 1,
        monto: 5000,
        estadoCuota: EstadoCuota.PENDIENTE,
        disciplina: { nombre: 'Futbol' },
        deportista: { nombre: 'Juan' },
        pagos: [],
      } as any);

      const response = await request(app)
        .get('/api/cuotas/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.nroCuota).toBe(1);
    });

    it('deberia retornar 404 si no existe', async () => {
      prismaMock.cuota.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/cuotas/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/cuotas/:id', () => {
    it('deberia actualizar monto de cuota', async () => {
      prismaMock.cuota.findUnique.mockResolvedValue({
        id: 1,
        nroCuota: 1,
        monto: 5000,
      } as any);

      prismaMock.cuota.update.mockResolvedValue({
        id: 1,
        nroCuota: 1,
        monto: 6000,
        disciplina: { nombre: 'Futbol' },
        deportista: { nombre: 'Juan' },
      } as any);

      const response = await request(app)
        .put('/api/cuotas/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ monto: 6000 });

      expect(response.status).toBe(200);
    });

    it('deberia retornar 400 si monto es negativo', async () => {
      const response = await request(app)
        .put('/api/cuotas/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ monto: -100 });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/cuotas/mi-estado', () => {
    it('deberia retornar estado de cuenta del deportista logueado', async () => {
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

      prismaMock.deportista.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        cuentaId: 2,
      } as any);

      prismaMock.cuota.findMany.mockResolvedValue([
        {
          id: 1,
          nroCuota: 1,
          monto: 5000,
          estadoCuota: EstadoCuota.PAGADA,
          pagos: [{ fechaPago: new Date(), medioPago: 'Mercado Pago' }],
        },
        {
          id: 2,
          nroCuota: 2,
          monto: 5000,
          estadoCuota: EstadoCuota.PENDIENTE,
          fechaVencimiento: new Date(),
          pagos: [],
        },
      ] as any);

      const response = await request(app)
        .get('/api/cuotas/mi-estado')
        .set('Authorization', `Bearer ${deportistaToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.cuotasPagadas).toHaveLength(1);
      expect(response.body.data.cuotasPendientes).toHaveLength(1);
      expect(response.body.data.totalAdeudado).toBe(5000);
    });
  });

  describe('GET /api/cuotas/deportista/:deportistaId', () => {
    it('deberia retornar cuotas de un deportista', async () => {
      prismaMock.cuota.findMany.mockResolvedValue([
        {
          id: 1,
          nroCuota: 1,
          monto: 5000,
          estadoCuota: EstadoCuota.PENDIENTE,
          disciplina: { nombre: 'Futbol' },
          pagos: [],
        },
      ] as any);
      prismaMock.cuota.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/cuotas/deportista/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.data).toHaveLength(1);
    });
  });
});
