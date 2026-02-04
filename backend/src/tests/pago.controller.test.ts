import request from 'supertest';
import express from 'express';
import { pagarCuota } from '../controllers/pago.controller';
import * as mercadopagoService from '../services/mercadopago.service';

// Mock del servicio
jest.mock('../services/mercadopago.service');

const app = express();
app.use(express.json());

// Middleware de autenticación mock
app.use((req, res, next) => {
    req.user = {
        id: 1,
        socioId: 1,
        email: 'test@example.com',
        role: 'SOCIO',
    };
    next();
});

app.post('/api/pagos', pagarCuota);

describe('Pago Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/pagos - pagarCuota', () => {
        it('debe crear una preferencia de pago exitosamente', async () => {
            // Arrange
            const mockPreferencia = {
                preferenceId: 'pref-123',
                initPoint: 'https://mercadopago.com/checkout',
                sandboxInitPoint: 'https://sandbox.mercadopago.com/checkout',
            };

            (mercadopagoService.crearPreferenciaPago as jest.Mock).mockResolvedValue(
                mockPreferencia
            );

            // Act
            const response = await request(app)
                .post('/api/pagos')
                .send({ cuotaId: 1 });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: 'Preferencia de pago creada',
                data: mockPreferencia,
            });

            expect(mercadopagoService.crearPreferenciaPago).toHaveBeenCalledWith({
                cuotaId: 1,
                deportistaId: 1,
                email: 'test@example.com',
            });
        });

        it('debe retornar error 400 si no hay deportistaId', async () => {
            // Arrange
            const appSinSocio = express();
            appSinSocio.use(express.json());
            appSinSocio.use((req, res, next) => {
                req.user = {
                    id: 1,
                    email: 'admin@example.com',
                    role: 'ADMIN',
                    socioId: undefined, // Sin socioId
                };
                next();
            });
            appSinSocio.post('/api/pagos', pagarCuota);

            // Act
            const response = await request(appSinSocio)
                .post('/api/pagos')
                .send({ cuotaId: 1 });

            // Assert
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: 'No se pudo identificar al deportista',
            });
        });

        it('debe retornar error 500 si falla la creación de preferencia', async () => {
            // Arrange
            (mercadopagoService.crearPreferenciaPago as jest.Mock).mockRejectedValue(
                new Error('Cuota no encontrada')
            );

            // Act
            const response = await request(app)
                .post('/api/pagos')
                .send({ cuotaId: 999 });

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                error: 'Cuota no encontrada',
            });
        });
    });
});
