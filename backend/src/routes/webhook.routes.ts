import { Router } from 'express';
import { procesarWebhook } from '../services/mercadopago.service';

const router = Router();

/**
 * CU08 - Webhook de Mercado Pago
 * Este endpoint procesa las notificaciones de pagos aprobados
 */
router.post('/mercadopago', async (req, res) => {
    try {
        console.log('📩 Webhook recibido desde Mercado Pago:', req.body);

        await procesarWebhook(req.body);

        // Mercado Pago espera una respuesta 200 OK
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error al procesar webhook:', error);
        // Aún así devolver 200 para que MP no reintente
        res.status(200).send('ERROR');
    }
});

export const webhookRoutes = router;
