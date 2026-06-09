# Addendum de Alcance E1 - RF-05

**Fecha:** Junio 2026  
**Proyecto:** App móvil Club For Ever

## Decisión

El RF-05 del documento de alcance indica: *"seleccionar una o varias cuotas pendientes para abonarlas en una sola transacción"*.

Para la entrega E1 se implementa:

- Selección **de una cuota a la vez** mediante interfaz de selección (radio/check) en Estado de Deuda.
- Una preferencia de Mercado Pago por cuota seleccionada.
- Monto del botón de pago calculado según la cuota elegida.

## Justificación

- El modelo de datos actual (`Pago` → una `cuotaId`) y el endpoint `POST /api/pagos/crear` están diseñados para un pago por cuota.
- Permite cerrar el flujo completo de pago (RF-06, RF-07) en el plazo de E1 con integración real a Mercado Pago Sandbox.
- El pago múltiple en una sola transacción queda planificado para E2 (extensión de API con `cuotaIds[]` y preferencia multi-item).

## Criterio de aceptación E1

- Given que tengo cuotas pendientes, when selecciono **una** cuota y confirmo, then la app inicia el flujo de Mercado Pago por el monto de esa cuota.
