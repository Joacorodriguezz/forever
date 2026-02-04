# Datos de Prueba (Seed)

Este archivo contiene datos mock para realizar pruebas manuales de los endpoints de la API.

## Cómo ejecutar el seed

```bash
# Opción 1: Ejecutar seed directamente
npm run prisma:seed

# Opción 2: Resetear la base de datos y ejecutar seed automáticamente
npm run prisma:reset
```

## Credenciales de acceso

### 👤 Admin
- **Email**: `admin@club.com`
- **Password**: `Admin123`
- **Rol**: ADMIN

### 👤 Administrativo
- **Email**: `secretaria@club.com`
- **Password**: `Admin123`
- **Rol**: ADMINISTRATIVO

### 👤 Deportistas

| Email | Password | Disciplina | Estado | Teléfonos | Enfermedades |
|-------|----------|------------|--------|-----------|--------------|
| `juan.perez@mail.com` | `Juan1234` | Fútbol | AL_DIA | 351-1234567, 351-7654321 | Asma leve |
| `maria.lopez@mail.com` | `Maria1234` | Natación | AL_DIA | 351-9876543 | Ninguna |
| `pedro.gonzalez@mail.com` | `Pedro1234` | Tenis | EN_DEUDA | 351-5555555, 351-4444444 | Diabetes tipo 1, Alergia al sol |
| `ana.martinez@mail.com` | `Ana12345` | Fútbol | INACTIVA | 351-3333333 | Ninguna |

## Datos creados

### Localidades
- **Córdoba Capital** (CP: 5000)
- **Villa Carlos Paz** (CP: 5001)

### Disciplinas
- **Fútbol** - $15,000/mes
- **Natación** - $18,000/mes
- **Tenis** - $20,000/mes

### Grupos Familiares
- **Familia Pérez** (Integrante: Juan Pérez)

### Cuotas y Pagos
- Juan Pérez: 
  - Cuota 1 (Enero) - PAGADA
  - Cuota 2 (Febrero) - PENDIENTE (pago en proceso)
- María López:
  - Cuota 1 (Enero) - PAGADA
- Pedro González:
  - Cuota 1 (Diciembre 2025) - VENCIDA
  - Cuota 2 (Enero 2026) - VENCIDA

## Endpoints para probar

### Autenticación
```bash
POST /api/auth/login
{
  "email": "admin@club.com",
  "password": "Admin123"
}
```

### Deportistas
```bash
# Listar deportistas (requiere auth)
GET /api/deportistas

# Ver deportista específico
GET /api/deportistas/1

# Crear deportista (ADMIN/ADMINISTRATIVO)
POST /api/deportistas
{
  "nombre": "Test",
  "apellido": "Usuario",
  "dni": "99999999",
  "fechaNac": "2005-01-01",
  "disciplinaId": 1,
  "email": "test@mail.com",
  "password": "Test1234",
  "domicilio": {
    "calle": "Test",
    "numero": "123",
    "localidadId": 1
  },
  "telefonos": "351-1111111, 351-2222222",
  "enfermedades": "Migraña, Hipertensión"
}

# Actualizar deportista
PUT /api/deportistas/1
{
  "nombre": "Juan Actualizado",
  "telefonos": "351-9999999",
  "enfermedades": "Asma controlada"
}

# Deportistas con pagos pendientes
GET /api/deportistas/pagos-pendientes

# Mi perfil (deportista logueado)
GET /api/deportistas/mi-perfil
```

### Disciplinas
```bash
# Listar disciplinas
GET /api/disciplinas

# Ver disciplina específica
GET /api/disciplinas/1
```

### Cuotas
```bash
# Listar cuotas
GET /api/cuotas

# Cuotas de un deportista
GET /api/cuotas?deportistaId=1
```

### Pagos
```bash
# Listar pagos
GET /api/pagos

# Crear pago
POST /api/pagos
{
  "cuotaId": 2,
  "medioPago": "Efectivo"
}
```

## Notas importantes

- Los campos `telefonos` y `enfermedades` ahora son strings simples (denormalizados)
- Puedes ingresar múltiples teléfonos separados por comas
- Las enfermedades también se ingresan como texto libre separado por comas
- El seed elimina todos los datos existentes antes de crear los nuevos
