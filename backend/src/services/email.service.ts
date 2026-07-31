import nodemailer from 'nodemailer';
import prisma from '../config/prisma';
import env from '../config/env';

interface SendPaymentReceiptInput {
  pagoId: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
}

function getMonthName(month: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  return months[month - 1] ?? `Cuota ${month}`;
}

export class EmailService {
  isConfigured(): boolean {
    return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.MAIL_FROM);
  }

  async sendPaymentReceipt(input: SendPaymentReceiptInput): Promise<void> {
    if (!this.isConfigured()) {
      console.warn('Email no configurado: se omite envio de comprobante', {
        pagoId: input.pagoId,
      });
      return;
    }

    const pago = await prisma.pago.findUnique({
      where: { id: input.pagoId },
      include: {
        cuota: {
          include: { disciplina: true },
        },
        deportista: {
          include: {
            cuenta: true,
            adultoResponsable: true,
          },
        },
      },
    });

    if (!pago) {
      console.warn('Email no enviado: pago no encontrado', { pagoId: input.pagoId });
      return;
    }

    const to = pago.deportista.adultoResponsable?.email || pago.deportista.cuenta.email;
    if (!to) {
      console.warn('Email no enviado: destinatario no disponible', { pagoId: input.pagoId });
      return;
    }

    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    const cuotaLabel = `${getMonthName(pago.cuota.nroCuota)} ${pago.cuota.anio}`;
    const amount = formatCurrency(Number(pago.monto));
    const receiptUrl = pago.linkComprobante || null;

    await transporter.sendMail({
      from: env.MAIL_FROM,
      to,
      subject: `Comprobante de pago - ${cuotaLabel}`,
      text: [
        `Hola ${pago.deportista.nombre} ${pago.deportista.apellido},`,
        '',
        'Tu pago fue aprobado correctamente.',
        '',
        `Cuota: ${cuotaLabel}`,
        `Disciplina: ${pago.cuota.disciplina.nombre}`,
        `Monto: ${amount}`,
        `Fecha: ${pago.fechaPago.toLocaleDateString('es-AR')}`,
        `Estado: ${pago.estadoPago}`,
        `ID interno: ${pago.id}`,
        `ID Mercado Pago: ${pago.mercadoPagoId || '-'}`,
        receiptUrl ? `Comprobante: ${receiptUrl}` : '',
        '',
        'Club Deportivo Forever',
      ].filter(Boolean).join('\n'),
      html: `
        <p>Hola ${pago.deportista.nombre} ${pago.deportista.apellido},</p>
        <p>Tu pago fue aprobado correctamente.</p>
        <ul>
          <li><strong>Cuota:</strong> ${cuotaLabel}</li>
          <li><strong>Disciplina:</strong> ${pago.cuota.disciplina.nombre}</li>
          <li><strong>Monto:</strong> ${amount}</li>
          <li><strong>Fecha:</strong> ${pago.fechaPago.toLocaleDateString('es-AR')}</li>
          <li><strong>Estado:</strong> ${pago.estadoPago}</li>
          <li><strong>ID interno:</strong> ${pago.id}</li>
          <li><strong>ID Mercado Pago:</strong> ${pago.mercadoPagoId || '-'}</li>
        </ul>
        ${receiptUrl ? `<p><a href="${receiptUrl}">Ver comprobante de Mercado Pago</a></p>` : ''}
        <p>Club Deportivo Forever</p>
      `,
    });
  }
}

export const emailService = new EmailService();
