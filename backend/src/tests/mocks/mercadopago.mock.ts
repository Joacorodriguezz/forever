import { MercadoPagoConfig } from 'mercadopago';

// Mock del SDK de Mercado Pago
export const mockPreferenceCreate = jest.fn();
export const mockPaymentGet = jest.fn();

jest.mock('mercadopago', () => {
    return {
        MercadoPagoConfig: jest.fn(),
        Preference: jest.fn().mockImplementation(() => ({
            create: mockPreferenceCreate,
        })),
        Payment: jest.fn().mockImplementation(() => ({
            get: mockPaymentGet,
        })),
    };
});

// Mock de Prisma
export const mockPrismaClient = {
    cuota: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    pago: {
        create: jest.fn(),
    },
    $disconnect: jest.fn(),
};

jest.mock('../config/prisma', () => mockPrismaClient);
