import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type MockPrismaClient = DeepMockProxy<PrismaClient>;

export const prismaMock = mockDeep<PrismaClient>();

jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: prismaMock,
  prisma: prismaMock,
}));
