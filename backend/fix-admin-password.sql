-- Actualizar contraseña del admin con hash correcto
-- Contraseña: admin123

UPDATE "cuentas_usuario" 
SET "password" = '$2b$10$Os0GgvIhw4OCi.bcnMGTeu59DFzRxW6iGT1aXKbpaw8o0P5EMXF7u',
    "intentos_fallidos" = 0,
    "bloqueado_hasta" = NULL,
    "updated_at" = NOW()
WHERE "email" = 'admin@foreverclub.com';

-- Verificar la actualización
SELECT 
  id_cuenta,
  email,
  rol,
  activo,
  intentos_fallidos,
  bloqueado_hasta
FROM "cuentas_usuario"
WHERE "email" = 'admin@foreverclub.com';
