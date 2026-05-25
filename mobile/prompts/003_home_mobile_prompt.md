# Prompt — Home / Dashboard Mobile (Sprint 003)

**Fecha de ejecución:** 2026-05-25

## Prompt textual del usuario

> Necesito que rediseñes e implementes la pantalla Home (`mobile/src/screens/HomeScreen.tsx`) siguiendo el mockup de `mobile/export/export.pdf` (página 2 — "Inicio") y el diseño en `mobile/forever-mobile.pen` (frame "02 – Inicio"). Solo modificar archivos dentro de `mobile/`. Reutilizar el backend existente del proyecto web. Seguir la estructura y convenciones ya establecidas en los sprints 001 (Login) y 002 (Estado de Deuda). Documentar en `mobile/prompts/` con prompt, plan, respuesta y changelog.

## Interpretación

- Rediseñar **HomeScreen** como dashboard con header gradiente, menú de 5 items, redes sociales y tab bar inferior.
- Introducir **navegación por bottom tabs** (`Inicio | Pagos | Noticias | Perfil`) con stacks anidados.
- Implementar pantallas del menú según PDF p.4–7: Historial de Pagos, Grupo Familiar, Noticias y Mi Perfil.
- Reutilizar backend existente sin modificar `backend/` ni `frontend/`.
- Documentar el sprint en `mobile/prompts/`.

## Restricciones

- Solo modificar archivos dentro de `mobile/`.
- Mantener TypeScript estricto y accesibilidad en botones.
- Respetar paleta `#003366` y convenciones de sprints anteriores.
