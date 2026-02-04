# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev              # Start dev server with hot reload (port 3000)
npm run build            # Compile TypeScript to ./dist
npm start                # Run production build
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

### Prisma Commands

```bash
npx prisma migrate dev   # Run migrations in development
npx prisma studio        # Open visual database browser
npx prisma generate      # Regenerate Prisma client after schema changes
```

## Architecture

This is an Express.js + TypeScript backend for a sports club management system using Prisma ORM with PostgreSQL (Supabase).

### Request Flow

```
Request → Route → Controller → Service → Prisma → Database
              ↓
        Middleware chain:
        1. CORS
        2. Body parsers
        3. Logger
        4. Authentication (JWT)
        5. Authorization (roles)
        6. Validation (Zod)
```

### Directory Structure

- **src/controllers/**: HTTP request handlers - parse request, call service, return response
- **src/services/**: Business logic layer - all database operations and business rules
- **src/routes/**: Route definitions with middleware chains
- **src/middlewares/**: Authentication, authorization, validation, error handling
- **src/validations/**: Zod schemas for request validation
- **src/types/**: TypeScript interfaces and DTOs
- **src/config/prisma.ts**: Singleton Prisma client with graceful shutdown
- **prisma/schema.prisma**: Database schema (291 lines)

### Authentication & Authorization

- JWT-based auth with Bearer tokens (1 hour expiration)
- Role-based access: `SOCIO`, `ADMIN`, `ADMINISTRATIVO`
- Middleware pattern: `authenticate()` → `authorize(...roles)`
- Passwords hashed with bcrypt

### Key Domain Models

- **Usuario**: User account with role
- **Deportista**: Club member/athlete (formerly "Socio" - renamed in schema)
- **Disciplina**: Sports activities with monthly fees
- **Cuota**: Monthly invoices (states: PENDIENTE, VENCIDA, PAGADA, EN_REVISION)
- **Pago**: Payment records linked to Cuota
- **GrupoFamiliar**: Family group management for member dependents

### Validation Pattern

All request validation uses Zod schemas via `validate(schema)` middleware:

```typescript
router.post('/', validate(createSchema), controller.create);
```

## Environment Setup

Required environment variables (see .env.example):
- `DATABASE_URL`: PostgreSQL connection string with pgbouncer
- `JWT_SECRET`: Secret for JWT signing
- `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`: For file storage
- `FRONTEND_URL`: For CORS whitelist

## Test Admin Account

- Email: admin123@gmail.com
- Password: admin123
