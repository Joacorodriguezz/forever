import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import env from '../config/env';
import { BadRequestError, ErrorMessages } from '../utils/errors';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export interface CreatePreferenceInput {
  pagoId: number;
  cuotaNro: number;
  cuotaAnio: number;
  disciplinaNombre: string;
  monto: number;
  deportistaNombre: string;
  deportistaApellido: string;
  payerEmail: string;
}

export interface PreferenceResult {
  preferenceId: string;
  checkoutUrl: string;
  publicKey: string;
}

export interface MercadoPagoPaymentInfo {
  id: string;
  status: string;
  externalReference: string | null;
}

function getClient(): MercadoPagoConfig | null {
  if (!env.MERCADOPAGO_ACCESS_TOKEN) {
    return null;
  }
  return new MercadoPagoConfig({ accessToken: env.MERCADOPAGO_ACCESS_TOKEN });
}

function getMonthLabel(nroCuota: number, anio: number): string {
  const month = MONTH_NAMES[nroCuota - 1] ?? `Cuota ${nroCuota}`;
  return `${month} ${anio}`;
}

export class MercadoPagoService {
  isConfigured(): boolean {
    return Boolean(env.MERCADOPAGO_ACCESS_TOKEN);
  }

  async createPreference(input: CreatePreferenceInput): Promise<PreferenceResult> {
    const title = `Cuota ${getMonthLabel(input.cuotaNro, input.cuotaAnio)} - ${input.disciplinaNombre}`;
    const publicKey = env.MERCADOPAGO_PUBLIC_KEY;

    const client = getClient();
    if (!client) {
      throw new BadRequestError(ErrorMessages.PAYMENT_SERVICE_UNAVAILABLE);
    }

    const preference = new Preference(client);
    const successUrl =
      env.MERCADOPAGO_SUCCESS_URL ||
      `forever://payment/result?pagoId=${input.pagoId}&status=approved`;
    const failureUrl =
      env.MERCADOPAGO_FAILURE_URL ||
      `forever://payment/result?pagoId=${input.pagoId}&status=rejected`;
    const pendingUrl =
      env.MERCADOPAGO_PENDING_URL ||
      `forever://payment/result?pagoId=${input.pagoId}&status=pending`;

    const response = await preference.create({
      body: {
        items: [
          {
            id: String(input.pagoId),
            title,
            description: `Pago cuota Club For Ever - ${input.deportistaNombre} ${input.deportistaApellido}`,
            quantity: 1,
            unit_price: Number(input.monto),
            currency_id: 'ARS',
          },
        ],
        external_reference: String(input.pagoId),
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        auto_return: 'approved',
        notification_url: env.MERCADOPAGO_WEBHOOK_URL || undefined,
        metadata: {
          pago_id: input.pagoId,
          cuota_nro: input.cuotaNro,
          cuota_anio: input.cuotaAnio,
        },
        payer: {
          email: input.payerEmail,
          name: input.deportistaNombre,
          surname: input.deportistaApellido,
        },
      },
    });

    const preferenceId = response.id;
    if (!preferenceId) {
      throw new BadRequestError('No se pudo crear la preferencia de Mercado Pago');
    }

    const checkoutUrl =
      response.init_point ||
      response.sandbox_init_point ||
      `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;

    return {
      preferenceId,
      checkoutUrl,
      publicKey,
    };
  }

  async getPayment(paymentId: string): Promise<MercadoPagoPaymentInfo | null> {
    const client = getClient();
    if (!client) {
      throw new BadRequestError(ErrorMessages.PAYMENT_SERVICE_UNAVAILABLE);
    }

    const payment = new Payment(client);
    const response = await payment.get({ id: paymentId });

    return {
      id: String(response.id ?? paymentId),
      status: response.status ?? 'pending',
      externalReference: response.external_reference ?? null,
    };
  }
}

export const mercadoPagoService = new MercadoPagoService();
