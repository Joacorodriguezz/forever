-- Desbloquear todas las cuentas bloqueadas
UPDATE cuentas_usuario 
SET 
  bloqueado_hasta = NULL,
  intentos_fallidos = 0
WHERE bloqueado_hasta IS NOT NULL;

-- Verificar que se desbloquearon
SELECT email, rol, bloqueado_hasta, intentos_fallidos 
FROM cuentas_usuario 
WHERE email = 'admin@foreverclub.com';
