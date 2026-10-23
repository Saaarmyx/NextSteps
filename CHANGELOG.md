# Changelog

Todos los cambios relevantes de NextSteps se anotan aquí.

El formato sigue [Keep a Changelog 1.1.0](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [Sin publicar]

La versión declarada en `package.json` es `2.0.0`, pero todavía no tiene un tag en el repositorio.

### Añadido

- Catálogo de planes con emoji, título, descripción y marca de plan futuro.
- Selección de plan accesible con teclado (`role="button"`, `tabIndex`, `aria-pressed`) y lector de pantalla.
- Barra de confirmación con el resumen del plan elegido.
- Modal de fecha, hora y nota opcional.
- Trampa de foco en el modal, cierre con `Escape` y devolución del foco al origen.
- Carta final con pétalos y opción de elegir otro plan.
- Fondo de jardín, animaciones y soporte de `prefers-reduced-motion`.
- Tokens de diseño y estilos globales.
- Endpoint `/api/session` con cookie `HttpOnly` firmada con HMAC-SHA256 y vigencia de una hora.
- Endpoint `/api/telegram` con validación de sesión, origen, cuerpo y rate limit de 5 envíos por IP cada 10 minutos.
- Timeout de 8 segundos en la llamada a Telegram.
- Metadatos de cliente opcionales con `INCLUDE_CLIENT_META`.
- Pruebas de validación, fechas, planes, API, seguridad y componentes.
- Documentación de variables de entorno y flujo.

### Cambiado

- La implementación vanilla anterior se reemplazó por React 19, TypeScript 6 y Vite 8.
- El proyecto pasó a usar funciones serverless en `api/` y configuración de Vercel.
- La confirmación ya no guarda el estado en `localStorage`; se resuelve en el servidor.
- El README se reescribió y se añadió la licencia Apache 2.0.
- Se añadieron `.editorconfig` y una guía de contribución.

### Corregido

- El envío sin cookie válida responde `401`.
- El origen se compara con el hostname del servidor; `ALLOWED_ORIGIN` fuerza la coincidencia estricta.
- La nota se sanea y se validan longitudes, fechas y horas antes de enviar.
- La IP y el sistema operativo solo se adjuntan si se habilita explícitamente.

[Sin publicar]: https://github.com/Saaarmyx/NextSteps/commits/main

<!-- TODO: añadir enlaces de comparación entre versiones cuando el repositorio tenga tags. -->
