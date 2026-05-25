# Respuesta de implementación — Estado de Deuda Mobile

**Fecha:** 2026-05-25

## Resumen

Se reemplazó el placeholder de `DebtStatusScreen` por una pantalla funcional que consume el endpoint `/api/cuotas/mi-estado` del backend web existente, y se ajustó la UI al mockup de `mobile/export/export.pdf` (pantalla "Estado de Deuda"). Se agregaron los tipos y servicios mobile siguiendo la misma estructura definida en el sprint 001.

## Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `src/types/cuota.ts` | Tipos `EstadoCuota`, `CuotaPendiente`, `CuotaPagada`, `EstadoCuentaResponse`, `DebtStatusData` |
| `src/services/cuotaService.ts` | `cuotaService.getMiEstado()` consumiendo `/cuotas/mi-estado` |
| `src/services/grupoFamiliarService.ts` | `grupoFamiliarService.getMios()` para detectar si el deportista es titular |
| `prompts/002_debt_status_mobile_prompt.md` | Prompt textual del usuario |
| `prompts/002_debt_status_mobile_response.md` | Esta respuesta |

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/screens/DebtStatusScreen.tsx` | Reemplazo del placeholder por la pantalla completa con header azul, badge de estado, total adeudado, lista de cuotas pendientes con estado (Vencida/Pendiente), banner Mercado Pago y botón inferior. |
| `src/navigation/AppNavigator.tsx` | `DebtStatus` con `headerShown: false` porque la pantalla incluye header propio (back + título) como en el mockup. |

## Endpoints utilizados

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/cuotas/mi-estado` | Cuotas pendientes y total adeudado del deportista logueado (CU07). |
| GET | `/api/grupos-familiares/mios` | Detectar si el deportista logueado es titular del grupo familiar (gating del botón de pago). |

## UI implementada (según `mobile/export/export.pdf` p. 3)

- **Header azul** (`#003366`) con flecha de retorno (`‹`) y título "Estado de Deuda".
- **Sección resumen** dentro del header azul:
  - Badge "Con deuda" (rojo) o "Al día" (verde).
  - Monto grande en blanco: `$ 14.500` formato `es-AR`.
  - Subtítulo: `Total adeudado • N cuota(s) pendiente(s)`.
- **Sección cuotas pendientes** (fondo `#F5F7FA`):
  - Título de sección `CUOTAS PENDIENTES` en gris/uppercase.
  - Tarjetas blancas con sombra: mes/año, subtítulo `Cuota mensual • <disciplina>`, monto a la derecha y pill de estado (`Vencida` rojo / `Pendiente` ámbar).
- **Banner informativo** con ícono `i`: "El pago se procesa vía Mercado Pago. Los pagos grupales se acreditan al titular."
- **Botón inferior** "Pagar con Mercado Pago" (azul). Se deshabilita si el usuario no es titular y se muestra una nota explicativa.
- **Estado vacío** (sin deuda): tarjeta con "¡Felicitaciones! No tenés cuotas pendientes de pago."
- **Loading state**: `ActivityIndicator` blanco sobre el header azul.

## Decisiones técnicas

1. **Reutilización del contrato existente** — el endpoint `/cuotas/mi-estado` devuelve la misma forma que ya consume la web (`DebtStatus.tsx`), por lo que no se requirió tocar backend.
2. **Mapeo conservador** — `monto` viene como `Decimal` desde Prisma; se hace `Number()` igual que la web.
3. **Disciplina opcional** — el backend hoy no retorna `disciplina` dentro de cada cuota; se respeta el fallback "Cuota mensual" cuando no está presente, replicando la lógica de la web.
4. **Gating de pago por titular** — siguiendo el mismo criterio que la web (`grupoFamiliarService.getMios()` + comparación con `titularDni`). Si la consulta falla se asume `esTitular = true` (no bloquea al usuario).
5. **Botón Mercado Pago** — el backend aún no expone integración; se muestra un `Alert` con mensaje "próximamente" (paridad con la web que muestra "Funcionalidad de pago en desarrollo").
6. **Header propio** — `headerShown: false` en el stack para que la pantalla controle el back arrow y el título exactamente como el mockup.
7. **Sin librerías nuevas** — se evitan dependencias adicionales (`lucide-react-native`, etc.) usando glifos Unicode (`‹`, `i`) y `View` con bordes para mantener el bundle liviano.

## Verificación

- TypeScript: el proyecto mobile aún no tiene `node_modules` instalado en el entorno actual, por lo que no se pudo correr `npx tsc --noEmit`. La revisión es manual; los tipos siguen la convención del sprint 001 (`ApiResponse<T>` reutilizado).
- Recomendado para QA local:
  ```bash
  cd forever/mobile
  npm install
  npx tsc --noEmit
  npm start
  ```

## Pendientes próxima iteración

- Integrar Mercado Pago real cuando el backend exponga el endpoint de preferencia.
- Persistir la disciplina del deportista en la respuesta de `/cuotas/mi-estado` para evitar el fallback "Cuota mensual".
- Agregar pull-to-refresh en el `ScrollView` para recargar el estado.
- Manejar errores de red con un banner reintento (hoy se muestra como "sin deuda").
- Probar end-to-end contra el backend Docker en emulador Android.
