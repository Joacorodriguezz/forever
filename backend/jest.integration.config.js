/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/integration/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testTimeout: 30000, // 30 segundos para tests de BD
  // NO usar setupFilesAfterEnv para evitar conflictos con mocks
  verbose: true,
  // Ejecutar tests secuencialmente
  maxWorkers: 1,
};
