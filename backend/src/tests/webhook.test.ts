import request from 'supertest';
import express from 'express';
import { webhookRoutes } from '../routes/webhook.routes';
import * as mercadopagoService from '../services/mercadopago.service';

// Mock del servicio
jest.mock('../services/mercadopago.service');

const app = express();
app.use(express.json());
app.use('/api/webhooks', webhookRoutes);

describe('Webhook Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/webhooks/mercadopago', () => {
        it('debe procesar un webhook válido y retornar 200', async () => {
            // Arrange
            const webhookPayload = {
                type: 'payment',
                action: 'payment.created',
                data: { id: 12345 },
            };

            (mercadopagoService.procesarWebhook as jest.Mock).mockResolvedValue(
                undefined
            );

            // Act
            const response = await request(app)
                .post('/api/webhooks/mercadopago')
                .send(webhookPayload);

            // Assert
            expect(response.status).toBe(200);
            expect(response.text).toBe('OK');
            expect(mercadopagoService.procesarWebhook).toHaveBeenCalledWith(
                webhookPayload
            );
        });

        it('debe retornar 200 incluso si hay error (para que MP no reintente)', async () => {
            // Arrange
            const webhookPayload = {
                type: 'payment',
                action: 'payment.created',
                data: { id: 12345 },
            };

            (mercadopagoService.procesarWebhook as jest.Mock).mockRejectedValue(
                new Error('Error de BD')
            );

            // Act
            const response = await request(app)
                .post('/api/webhooks/mercadopago')
                .send(webhookPayload);

            // Assert
            expect(response.status).toBe(200);
            expect(response.text).toBe('ERROR');
        });

        it('debe procesar webhooks de diferentes tipos', async () => {
            // Arrange
            const webhookPayload = {
                type: 'subscription',
                action: 'subscription.created',
                data: { id: 67890 },
            };

            (mercadopagoService.procesarWebhook as jest.Mock).mockResolvedValue(
                undefined
            );

            // Act
            const response = await request(app)
                .post('/api/webhooks/mercadopago')
                .send(webhookPayload);

            // Assert
            expect(response.status).toBe(200);
            expect(mercadopagoService.procesarWebhook).toHaveBeenCalledWith(
                webhookPayload
            );
        });
    });
});
