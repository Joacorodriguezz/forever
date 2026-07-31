# Prompt - Implementacion Mercado Pago

**Objetivo:** Planificar la implementacion real de pagos con Mercado Pago en la app mobile, reemplazando el flujo simulado actual e incorporando envio de comprobante por email.

---

## User

Necesito que realices un plan de implementacion para los pagos con Mercado Pago. En este momento los pagos estan simulados. Nosotros queremos que el socio (user), al pagar, sea redireccionado a su App de MercadoPago y ya ya tenga cargado el monto a pagar y la cuenta del club. Al realizar el pago, le debe llegar un mail al user con el comprobante.
Lo mas importante aca, es saber cuanto debe pagar el socio, ya que puede estar pagando mas de una cuota, o paga el grupo familiar, etc. Tambien, ten en cuenta que primero utilizaremos tokens de prueba en el comienzo, asi que deja el .env vacio para que yo luego cargue los datos de la cuenta de MercadoPago

---

## Interpretacion

- Reemplazar el modo simulado de Mercado Pago por una integracion real usando Checkout Pro.
- Al tocar **Pagar**, el socio debe salir de la app Forever hacia Mercado Pago, preferentemente a la app instalada en el telefono.
- El checkout debe abrir con:
  - monto correcto a pagar,
  - descripcion de la cuota o cuotas,
  - cuenta receptora del club configurada por token.
- Al terminar el pago, el usuario debe volver a la app Forever.
- Si Mercado Pago confirma el pago como aprobado, el backend debe actualizar la deuda y enviar un email con comprobante.
- Primero se usaran credenciales de prueba Sandbox, dejando el `.env` preparado pero vacio para completar luego.

## Contexto actual del proyecto

| Area | Hallazgo |
|------|----------|
| Backend | Ya existe `backend/src/services/mercadopago.service.ts` |
| Backend | Ya existe `POST /api/pagos/crear` |
| Backend | Ya existe `POST /api/pagos/webhook` |
| Backend | Si no hay token de Mercado Pago, hoy se usa flujo simulado |
| Mobile | `DebtStatusScreen` permite seleccionar cuota y abrir `checkoutUrl` |
| Mobile | `PaymentResultScreen` muestra resultado consultando el backend |
| Mobile | Existe deep link `forever://payment/result` |
| Datos contacto | `CuentaUsuario.email` existe para el socio |
| Datos contacto | `AdultoResponsable.email` y `telefono` existen para menores |
| Grupo familiar | Existe `GrupoFamiliar.titularDni`, pero no email propio del grupo |

## Decision inicial

Para la primera version se implementara con **Mercado Pago Sandbox**.

No se usaran credenciales personales ni productivas al inicio. El `.env` debe quedar preparado con las claves vacias para que luego se carguen los datos reales o de prueba.

## Variables de entorno a preparar

Crear o actualizar `.env` en `backend`:

```env
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_WEBHOOK_URL=
MERCADOPAGO_SUCCESS_URL=
MERCADOPAGO_FAILURE_URL=
MERCADOPAGO_PENDING_URL=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

Notas:

- `MERCADOPAGO_ACCESS_TOKEN` define la cuenta que recibe el dinero.
- Para Sandbox se cargara un token `TEST-*`.
- Para produccion, mas adelante, se cargara el token productivo de la cuenta del club.
- `MERCADOPAGO_WEBHOOK_URL` debe ser una URL publica HTTPS. Mercado Pago no puede notificar a `localhost`.

## Punto critico: calculo del monto a pagar

Antes de abrir Mercado Pago, el backend debe calcular el monto final. El mobile no debe decidir el total, solo debe enviar que cuotas quiere pagar.

### Casos a contemplar

| Caso | Regla propuesta |
|------|-----------------|
| Socio normal paga una cuota | Monto = `Cuota.monto` |
| Socio normal paga varias cuotas | Monto = suma de cuotas pendientes seleccionadas |
| Grupo familiar paga una cuota | Solo puede pagar el titular; monto = cuota seleccionada |
| Grupo familiar paga varias cuotas | Solo puede pagar el titular; monto = suma de cuotas seleccionadas validas |
| Cuota ya pagada | No se incluye; devolver error si fue seleccionada |
| Cuota que no pertenece al socio/grupo | Rechazar operacion |

### Recomendacion de alcance

El modelo actual de `Pago` tiene una sola `cuotaId`, por lo que hoy esta preparado para **una cuota por pago**.

Si se quiere pagar mas de una cuota en una sola operacion, hay dos opciones:

1. **Opcion conservadora para Entrega 3:** mantener una cuota por transaccion y documentar esa decision.
2. **Opcion completa:** modificar el modelo para que un pago pueda tener varias cuotas.

Para que el requerimiento de "puede estar pagando mas de una cuota" quede bien resuelto, la opcion completa es la mas correcta.

## Cambios backend propuestos

### 1. Ajustar modelo de pagos si se decide soportar multiples cuotas

Modelo actual:

- `Pago.cuotaId`
- Un pago pertenece a una cuota.

Modelo propuesto:

- `Pago`
- `PagoCuota` como tabla intermedia entre pagos y cuotas.

Ejemplo conceptual:

```prisma
model Pago {
  id                Int
  monto             Decimal
  estadoPago        EstadoPago
  mercadoPagoId     String?
  mercadoPagoStatus String?
  linkComprobante   String?
  deportistaId      Int
  cuotas            PagoCuota[]
}

model PagoCuota {
  pagoId  Int
  cuotaId Int
}
```

Si se decide no modificar schema para esta entrega, se mantiene pago individual y se crea una preferencia por cuota seleccionada.

### 2. Crear preferencia real de Mercado Pago

Archivo principal:

- `backend/src/services/mercadopago.service.ts`

Tareas:

- Usar `MERCADOPAGO_ACCESS_TOKEN`.
- Crear preferencia con items calculados por backend.
- Cargar monto exacto.
- Usar `external_reference` con el `pagoId` interno.
- Configurar `notification_url`.
- Configurar `back_urls`.
- Devolver `checkoutUrl` real al mobile.

### 3. Confirmar pagos por webhook

Archivos:

- `backend/src/controllers/pago.controller.ts`
- `backend/src/services/pago.service.ts`

Reglas:

- Mercado Pago envia evento al webhook.
- Backend consulta el pago real usando SDK/API de Mercado Pago.
- Si `status === approved`:
  - `Pago.estadoPago = APROBADO`
  - cuotas asociadas pasan a `PAGADA`
  - se guarda `mercadoPagoId`
  - se guarda `mercadoPagoStatus`
  - se guarda link de comprobante si esta disponible
  - se dispara envio de email
- Si `status === rejected`, marcar pago rechazado.
- Si `status === pending` o `in_process`, mantener pendiente.

Importante: no aprobar pagos solo por parametros del deep link, porque eso podria manipularse desde el cliente.

### 4. Enviar email con comprobante

Usar `nodemailer`, que ya esta en dependencias del backend.

Archivo sugerido:

- `backend/src/services/email.service.ts`

Destinatario:

1. Si existe `adultoResponsable.email`, enviar a ese email.
2. Si no, enviar a `deportista.cuenta.email`.
3. Para grupo familiar, si corresponde notificar al titular, buscar titular por `titularDni` y usar su `cuenta.email`.

Contenido minimo:

- Nombre y apellido del socio.
- Cuota o cuotas pagadas.
- Disciplina.
- Monto total.
- Fecha de pago.
- Estado del pago.
- ID interno del pago.
- ID de Mercado Pago.
- Link al comprobante, si existe.

Regla importante:

- Si falla el envio del mail, el pago no debe revertirse.
- El error de email debe quedar registrado para revision.

## Cambios mobile propuestos

Archivos:

- `mobile/src/screens/DebtStatusScreen.tsx`
- `mobile/src/screens/PaymentResultScreen.tsx`
- `mobile/src/screens/PaymentDetailScreen.tsx`
- `mobile/src/navigation/AppNavigator.tsx`

Tareas:

- Permitir seleccionar una o varias cuotas, si se decide implementar pago multiple.
- Enviar al backend los IDs de cuotas seleccionadas.
- Mostrar el total calculado visualmente, pero confiar en el total final del backend.
- Abrir el `checkoutUrl` real de Mercado Pago.
- Mantener deep link `forever://payment/result`.
- Al volver a la app, consultar estado real del pago al backend.
- Mostrar estados aprobado, pendiente, rechazado y error.
- Refrescar deuda e historial luego del pago.

## Flujo final esperado

1. Socio entra a Estado de Deuda.
2. Selecciona cuota o cuotas.
3. La app muestra el total estimado.
4. Socio toca **Pagar con Mercado Pago**.
5. Mobile envia cuotas seleccionadas al backend.
6. Backend valida pertenencia, estado y monto.
7. Backend crea `Pago` pendiente.
8. Backend crea preferencia real de Mercado Pago.
9. Mobile abre Mercado Pago con monto y cuenta del club ya configurados.
10. Socio paga.
11. Mercado Pago notifica al backend por webhook.
12. Backend consulta Mercado Pago y confirma estado real.
13. Backend marca pago/cuotas segun corresponda.
14. Backend envia email con comprobante.
15. Usuario vuelve a Forever por deep link.
16. App muestra resultado actualizado.

## Pruebas necesarias

### Mercado Pago Sandbox

- Crear vendedor de prueba.
- Crear comprador de prueba.
- Cargar tokens `TEST-*` del vendedor en `.env`.
- Exponer backend con HTTPS publico.
- Configurar webhook.
- Hacer pago desde la app.
- Verificar que el dinero de prueba llegue al vendedor de prueba.
- Verificar que el pago quede aprobado en backend.
- Verificar que la cuota quede pagada.
- Verificar que llegue email de comprobante.

### Casos funcionales

- Pago aprobado.
- Pago pendiente.
- Pago rechazado.
- Usuario cancela el checkout.
- Webhook llega tarde.
- Usuario vuelve a la app antes de la confirmacion.
- Cuota ya pagada.
- Cuota ajena.
- Grupo familiar sin ser titular intenta pagar.
- Falla SMTP despues de pago aprobado.

## Criterios de aceptacion

- [ ] El flujo principal no usa simulacion.
- [ ] La app abre Mercado Pago real en Sandbox.
- [ ] El monto lo calcula y valida el backend.
- [ ] La cuenta receptora se define por el token de Mercado Pago configurado.
- [ ] Se soporta correctamente el alcance definido: una cuota por pago o multiples cuotas por pago.
- [ ] El pago se confirma desde webhook/consulta a Mercado Pago.
- [ ] Las cuotas se marcan pagadas solo si Mercado Pago confirma `approved`.
- [ ] El socio vuelve a la app y ve el resultado.
- [ ] Se envia email con comprobante.
- [ ] Si falla el email, no se pierde ni revierte el pago.
- [ ] El `.env` queda preparado con claves vacias para completar.
- [ ] Las credenciales reales no quedan versionadas.

## Riesgos y decisiones pendientes

| Tema | Decision pendiente |
|------|--------------------|
| Multiples cuotas | Definir si Entrega 3 exige pagarlas en una sola transaccion o si alcanza una cuota por pago |
| Grupo familiar | Definir si paga solo titular o tambien otros integrantes autorizados |
| Email | Definir proveedor SMTP real |
| Comprobante | Definir si alcanza link de Mercado Pago o si el club necesita comprobante propio |
| Produccion | Definir cuando reemplazar tokens `TEST-*` por credenciales reales del club |

## Fuera de alcance inicial

- Usar cuenta personal de Mercado Pago.
- Credenciales productivas desde el inicio.
- Envio por WhatsApp o SMS.
- Comprobante fiscal propio.
- Conciliacion contable avanzada.
