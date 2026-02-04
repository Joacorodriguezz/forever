import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import prisma from '../config/prisma';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || '',
    options: {
        timeout: 5000,
    }
});

const preferenceApi = new Preference(client);
const paymentApi = new Payment(client);

interface CrearPreferenciaParams {
    cuotaId: number;
    deportistaId: number;
    email: string;
}

/**
 * CU08 - Pagar Cuota: Crear preferencia de Mercado Pago
 */
export async function crearPreferenciaPago(params: CrearPreferenciaParams) {
    const { cuotaId, deportistaId, email } = params;

    // Buscar la cuota
    const cuota = await prisma.cuota.findUnique({
        where: { id_cuota: cuotaId },
        include: {
            disciplina: true,
            deportista: {
                include: { cuenta: true }
            }
        }
    });

    if (!cuota) {
        throw new Error('Cuota no encontrada');
    }

    if (cuota.deportista_id !== deportistaId) {
        throw new Error('Esta cuota no pertenece al deportista');
    }

    if (cuota.estadoCuota === 'PAGADA') {
        throw new Error('Esta cuota ya fue pagada');
    }

    // Crear preferencia de pago
    const preference = await preferenceApi.create({
        body: {
            items: [
                {
                    id: `cuota-${cuotaId}`,
                    title: `Cuota ${cuota.mes || 'N/A'} - ${cuota.disciplina?.nombre || 'Mensual'}`,
                    description: `Pago de cuota mensual #${cuota.nroCuota || cuotaId}`,
                    quantity: 1,
                    unit_price: Number(cuota.monto),
                    currency_id: 'ARS',
                },
            ],
            payer: {
                email: email,
                name: cuota.deportista.nombre,
                surname: cuota.deportista.apellido,
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/pagos/success`,
                failure: `${process.env.FRONTEND_URL}/pagos/failure`,
                pending: `${process.env.FRONTEND_URL}/pagos/pending`,
            },
            auto_return: 'approved',
            notification_url: `${process.env.BACKEND_URL}/api/webhooks/mercadopago`,
            metadata: {
                cuota_id: cuotaId,
                deportista_id: deportistaId,
            },
            statement_descriptor: 'CLUB DEPORTIVO',
            external_reference: `CUOTA-${cuotaId}`,
        },
    });

    return {
        preferenceId: preference.id,
        initPoint: preference.init_point,
        sandboxInitPoint: preference.sandbox_init_point,
    };
}

/**
 * CU08 - Procesar webhook de Mercado Pago
 */
export async function procesarWebhook(data: any) {
    const { type, action, data: paymentData } = data;

    console.log('📩 Webhook recibido:', { type, action, paymentData });

    // Solo procesar pagos
    if (type === 'payment') {
        const paymentId = paymentData?.id;

        if (!paymentId) {
            console.error('Payment ID no encontrado en webhook');
            return;
        }

        try {
            // Obtener información del pago
            const payment = await paymentApi.get({ id: paymentId });

            console.log('💳 Pago obtenido:', {
                id: payment.id,
                status: payment.status,
                metadata: payment.metadata
            });

            if (payment.status === 'approved') {
                const cuotaId = Number(payment.metadata?.cuota_id);
                const deportistaId = Number(payment.metadata?.deportista_id);

                if (!cuotaId || !deportistaId) {
                    console.error('Metadata incompleta en el pago:', payment.metadata);
                    return;
                }

                // Actualizar cuota a PAGADA
                await prisma.cuota.update({
                    where: { id_cuota: cuotaId },
                    data: { estadoCuota: 'PAGADA' },
                });

                // Registrar pago
                await prisma.pago.create({
                    data: {
                        id_cuota: cuotaId,
                        id_deportista: deportistaId,
                        fechaPago: new Date(),
                        estadoPago: 'APROBADO',
                        linkComprobante: `https://www.mercadopago.com.ar/activities?q=${payment.id}`,
                    },
                });

                // CU09 - Enviar notificación
                const cuota = await prisma.cuota.findUnique({
                    where: { id_cuota: cuotaId },
                    include: { deportista: { include: { cuenta: true } } },
                });

                if (cuota?.deportista.cuenta.mail) {
                    const { notificarPagoConfirmado } = await import('./notificacion.service');
                    await notificarPagoConfirmado(
                        cuota.deportista.cuenta.mail,
                        cuotaId,
                        Number(cuota.monto),
                        new Date().toISOString()
                    );
                }

                console.log(`✅ Pago procesado: Cuota #${cuotaId} pagada por deportista #${deportistaId}`);
            }
        } catch (error) {
            console.error('Error al procesar webhook:', error);
            throw error;
        }
    }
}

/**
 * Obtener información de un pago
 */
export async function obtenerPago(paymentId: number) {
    return await paymentApi.get({ id: paymentId });
}
