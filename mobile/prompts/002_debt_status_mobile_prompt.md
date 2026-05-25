# Prompt — Estado de Deuda Mobile

**Fecha de ejecución:** 2026-05-25
**Usuario:** joaco.rodriguez800@gmail.com

## Prompt textual del usuario

> Necesito que siguiendo la estructura del proyecto actual, solo tocando la carpeta mobile, necesito que desarrolles la parte de estado de deuda. Base en la informacion del repo para poder seguir con la misma estrucutra y el frontend tal cual esta. Estamos usando el backend de la web de escritorio y el frontend tiene que seguir lo que esta en la parte de export pdf. Ademas, necesito que agregues los prompts que hice textuales a la parte de prompts y tu respuesta.

## Interpretación

- Implementar pantalla **Estado de Deuda** en `mobile/` (React Native + Expo) reemplazando el placeholder actual.
- Reutilizar el **backend existente** del proyecto web de escritorio (`/api/cuotas/mi-estado` y `/api/grupos-familiares/mios`).
- Seguir el **diseño del mockup** ubicado en `mobile/export/export.pdf` (pantalla "Estado de Deuda", página 3).
- Mantener la **estructura del proyecto mobile** ya establecida en el sprint 001 (carpetas `src/services`, `src/screens`, `src/types`, etc.).
- Documentar el sprint en `mobile/prompts/` con el prompt textual y la respuesta.

## Restricciones

- Solo modificar archivos dentro de `mobile/`.
- No tocar el backend ni el frontend de escritorio.
- Respetar la convención visual (paleta azul `#003366`, tipografías y radios) que ya viene del LoginScreen.
