import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { prismaMock } from './mocks/prisma.mock';
import { Rol } from '@prisma/client';

describe('Disciplina Module', () => {
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

  describe('POST /api/disciplinas', () => {
    const disciplinaData = {
      nombre: 'Futbol',
      descripcion: 'Futbol 11',
      precioMensual: 5000,
    };

    it('deberia retornar 401 sin token', async () => {
      const response = await request(app)
        .post('/api/disciplinas')
        .send(disciplinaData);

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
        .post('/api/disciplinas')
        .set('Authorization', `Bearer ${deportistaToken}`)
        .send(disciplinaData);

      expect(response.status).toBe(403);
    });

    it('deberia retornar 400 si falta nombre', async () => {
      const response = await request(app)
        .post('/api/disciplinas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ precioMensual: 5000 });

      expect(response.status).toBe(400);
    });

    it('deberia retornar 400 si precio es negativo', async () => {
      const response = await request(app)
        .post('/api/disciplinas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...disciplinaData, precioMensual: -100 });

      expect(response.status).toBe(400);
    });

    it('deberia retornar 409 si el nombre ya existe', async () => {
      prismaMock.disciplina.findUnique.mockResolvedValue({ id: 1 } as any);

      const response = await request(app)
        .post('/api/disciplinas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(disciplinaData);

      expect(response.status).toBe(409);
    });

    it('deberia retornar 201 al crear disciplina', async () => {
      prismaMock.disciplina.findUnique.mockResolvedValue(null);
      prismaMock.disciplina.create.mockResolvedValue({
        id: 1,
        nombre: 'Futbol',
        descripcion: 'Futbol 11',
        precioMensual: 5000,
        activa: true,
      } as any);

      const response = await request(app)
        .post('/api/disciplinas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(disciplinaData);

      expect(response.status).toBe(201);
      expect(response.body.data.nombre).toBe('Futbol');
    });
  });

  describe('GET /api/disciplinas', () => {
    it('deberia retornar lista de disciplinas', async () => {
      prismaMock.disciplina.findMany.mockResolvedValue([
        { id: 1, nombre: 'Futbol', precioMensual: 5000, activa: true, _count: { deportistas: 10 } },
        { id: 2, nombre: 'Basquet', precioMensual: 4500, activa: true, _count: { deportistas: 8 } },
      ] as any);

      const response = await request(app)
        .get('/api/disciplinas')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
    });

    it('deberia filtrar disciplinas activas por defecto', async () => {
      prismaMock.disciplina.findMany.mockResolvedValue([
        { id: 1, nombre: 'Futbol', activa: true },
      ] as any);

      const response = await request(app)
        .get('/api/disciplinas')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('deberia incluir inactivas si se solicita', async () => {
      prismaMock.disciplina.findMany.mockResolvedValue([
        { id: 1, nombre: 'Futbol', activa: true },
        { id: 2, nombre: 'Tenis', activa: false },
      ] as any);

      const response = await request(app)
        .get('/api/disciplinas?includeInactive=true')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/disciplinas/:id', () => {
    it('deberia retornar disciplina por ID', async () => {
      prismaMock.disciplina.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Futbol',
        descripcion: 'Futbol 11',
        precioMensual: 5000,
        activa: true,
        _count: { deportistas: 10 },
      } as any);

      const response = await request(app)
        .get('/api/disciplinas/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.nombre).toBe('Futbol');
    });

    it('deberia retornar 404 si no existe', async () => {
      prismaMock.disciplina.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/disciplinas/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/disciplinas/:id', () => {
    it('deberia actualizar precio mensual', async () => {
      prismaMock.disciplina.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Futbol',
        precioMensual: 5000,
      } as any);
      prismaMock.disciplina.update.mockResolvedValue({
        id: 1,
        nombre: 'Futbol',
        precioMensual: 6000,
      } as any);

      const response = await request(app)
        .put('/api/disciplinas/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ precioMensual: 6000 });

      expect(response.status).toBe(200);
    });

    it('deberia desactivar disciplina', async () => {
      prismaMock.disciplina.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Futbol',
        activa: true,
      } as any);
      prismaMock.disciplina.update.mockResolvedValue({
        id: 1,
        nombre: 'Futbol',
        activa: false,
      } as any);

      const response = await request(app)
        .put('/api/disciplinas/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ activa: false });

      expect(response.status).toBe(200);
    });

    it('deberia retornar 409 si nombre duplicado', async () => {
      prismaMock.disciplina.findUnique
        .mockResolvedValueOnce({ id: 1, nombre: 'Futbol' } as any)
        .mockResolvedValueOnce({ id: 2, nombre: 'Basquet' } as any);

      const response = await request(app)
        .put('/api/disciplinas/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Basquet' });

      expect(response.status).toBe(409);
    });
  });

  describe('GET /api/disciplinas/:id/deportistas', () => {
    it('deberia retornar deportistas de una disciplina', async () => {
      prismaMock.disciplina.findUnique.mockResolvedValue({ id: 1 } as any);
      prismaMock.deportista.findMany.mockResolvedValue([
        { id: 1, nombre: 'Juan', apellido: 'Perez', cuenta: { email: 'juan@test.com' } },
        { id: 2, nombre: 'Maria', apellido: 'Garcia', cuenta: { email: 'maria@test.com' } },
      ] as any);
      prismaMock.deportista.count.mockResolvedValue(2);

      const response = await request(app)
        .get('/api/disciplinas/1/deportistas')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.data).toHaveLength(2);
    });

    it('deberia retornar 404 si disciplina no existe', async () => {
      prismaMock.disciplina.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/disciplinas/999/deportistas')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});
