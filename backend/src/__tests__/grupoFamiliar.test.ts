import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { prismaMock } from './mocks/prisma.mock';
import { Rol, Vinculo } from '@prisma/client';

describe('Grupo Familiar Module', () => {
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

  describe('POST /api/grupos-familiares', () => {
    const grupoData = {
      nombre: 'Familia Perez',
      integrantes: [
        { deportistaId: 1, vinculo: 'PADRE', esPrincipal: true },
        { deportistaId: 2, vinculo: 'HIJO', esPrincipal: false },
      ],
    };

    it('deberia retornar 401 sin token', async () => {
      const response = await request(app)
        .post('/api/grupos-familiares')
        .send(grupoData);

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
        .post('/api/grupos-familiares')
        .set('Authorization', `Bearer ${deportistaToken}`)
        .send(grupoData);

      expect(response.status).toBe(403);
    });

    it('deberia retornar 400 si faltan integrantes', async () => {
      const response = await request(app)
        .post('/api/grupos-familiares')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Familia Perez' });

      expect(response.status).toBe(400);
    });

    it('deberia retornar 400 si hay menos de 2 integrantes', async () => {
      const response = await request(app)
        .post('/api/grupos-familiares')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Familia Perez',
          integrantes: [{ deportistaId: 1, vinculo: 'PADRE', esPrincipal: true }],
        });

      expect(response.status).toBe(400);
    });

    it('deberia retornar 400 si no hay integrante principal', async () => {
      const response = await request(app)
        .post('/api/grupos-familiares')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Familia Perez',
          integrantes: [
            { deportistaId: 1, vinculo: 'PADRE', esPrincipal: false },
            { deportistaId: 2, vinculo: 'HIJO', esPrincipal: false },
          ],
        });

      expect(response.status).toBe(400);
    });

    it('deberia retornar 404 si algun deportista no existe', async () => {
      prismaMock.deportista.findMany.mockResolvedValue([{ id: 1 }] as any);

      const response = await request(app)
        .post('/api/grupos-familiares')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(grupoData);

      expect(response.status).toBe(404);
    });

    it('deberia retornar 201 al crear grupo familiar', async () => {
      prismaMock.deportista.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }] as any);
      prismaMock.grupoFamiliar.findMany.mockResolvedValue([]);
      prismaMock.grupoFamiliar.create.mockResolvedValue({
        id: 1,
        nombre: 'Familia Perez',
        integrantes: [
          { deportistaId: 1, vinculo: Vinculo.PADRE, esPrincipal: true, deportista: { nombre: 'Juan' } },
          { deportistaId: 2, vinculo: Vinculo.HIJO, esPrincipal: false, deportista: { nombre: 'Pedro' } },
        ],
      } as any);

      const response = await request(app)
        .post('/api/grupos-familiares')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(grupoData);

      expect(response.status).toBe(201);
      expect(response.body.data.nombre).toBe('Familia Perez');
    });

    it('deberia retornar 409 si el grupo ya existe', async () => {
      prismaMock.deportista.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }] as any);
      prismaMock.grupoFamiliar.findMany.mockResolvedValue([
        {
          id: 1,
          integrantes: [{ deportistaId: 1 }, { deportistaId: 2 }],
        },
      ] as any);

      const response = await request(app)
        .post('/api/grupos-familiares')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(grupoData);

      expect(response.status).toBe(409);
    });
  });

  describe('GET /api/grupos-familiares', () => {
    it('deberia retornar lista de grupos familiares', async () => {
      prismaMock.grupoFamiliar.findMany.mockResolvedValue([
        {
          id: 1,
          nombre: 'Familia Perez',
          integrantes: [
            { deportista: { nombre: 'Juan' }, vinculo: Vinculo.PADRE },
            { deportista: { nombre: 'Pedro' }, vinculo: Vinculo.HIJO },
          ],
        },
      ] as any);
      prismaMock.grupoFamiliar.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/grupos-familiares')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.data).toHaveLength(1);
    });
  });

  describe('GET /api/grupos-familiares/:id', () => {
    it('deberia retornar grupo familiar por ID', async () => {
      prismaMock.grupoFamiliar.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Familia Perez',
        integrantes: [
          { deportista: { nombre: 'Juan', disciplina: { nombre: 'Futbol' } }, vinculo: Vinculo.PADRE },
        ],
      } as any);

      const response = await request(app)
        .get('/api/grupos-familiares/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.nombre).toBe('Familia Perez');
    });

    it('deberia retornar 404 si no existe', async () => {
      prismaMock.grupoFamiliar.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/grupos-familiares/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/grupos-familiares/:id', () => {
    it('deberia actualizar nombre del grupo', async () => {
      prismaMock.grupoFamiliar.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Familia Perez',
      } as any);

      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        return callback({
          grupoFamiliar: { update: jest.fn().mockResolvedValue({}) },
          grupoFamiliarIntegrante: { deleteMany: jest.fn(), create: jest.fn() },
        });
      });

      prismaMock.grupoFamiliar.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Familia Garcia',
        integrantes: [],
      } as any);

      const response = await request(app)
        .put('/api/grupos-familiares/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Familia Garcia' });

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/grupos-familiares/:id', () => {
    it('deberia eliminar grupo familiar', async () => {
      prismaMock.grupoFamiliar.findUnique.mockResolvedValue({
        id: 1,
        nombre: 'Familia Perez',
      } as any);
      prismaMock.grupoFamiliar.delete.mockResolvedValue({} as any);

      const response = await request(app)
        .delete('/api/grupos-familiares/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.message).toContain('eliminado');
    });

    it('deberia retornar 404 si no existe', async () => {
      prismaMock.grupoFamiliar.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/grupos-familiares/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});
