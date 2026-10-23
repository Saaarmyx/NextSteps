<div align="center">

# NextSteps

Planificador de salidas: elige un plan, propón fecha y hora, y recibe la confirmación por Telegram.

[![Licencia](https://img.shields.io/badge/Licencia-Apache_2.0-D22128?logo=apache&logoColor=white)](LICENSE)
![Estado](https://img.shields.io/badge/Estado-Beta-F59E0B)
![Versión](https://img.shields.io/badge/Versión-2.0.0-8B5CF6)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

</div>

## Estado del proyecto

**Beta.** El flujo completo funciona y tiene pruebas; falta validarlo con un despliegue real y cerrar el rate limit para varias instancias.

## Descripción

NextSteps nació como una sorpresa: una web donde la otra persona elige el plan de la próxima salida y lo confirma con fecha y hora. Quería que la experiencia se sintiera cuidada —jardín, pétalos, carta final— sin exponer el token del bot en el navegador.

La app es una SPA de React con una función serverless en Vercel. El frontend valida la selección, pide una sesión firmada y envía la confirmación a `/api/telegram`. El token y el chat ID viven solo en el servidor.

## Características principales

- Catálogo de planes con emoji, título, descripción y planes futuros.
- Selección accesible con teclado y lector de pantalla.
- Modal de confirmación con fecha, hora y nota opcional.
- Trampa de foco, cierre con `Escape` y devolución del foco al origen.
- Carta final con pétalos y opción de elegir otro plan.
- Diseño responsive con fondo de jardín y animaciones que respetan `prefers-reduced-motion`.
- Endpoint `/api/session` que emite una cookie `HttpOnly` firmada con HMAC-SHA256.
- Endpoint `/api/telegram` con validación de sesión, origen, cuerpo y rate limit.
- Timeout de 8 segundos en la llamada a Telegram.
- Metadatos del cliente opcionales (`INCLUDE_CLIENT_META`).
- Pruebas con Vitest, Testing Library y jsdom.

## Requisitos

- Node.js ≥ 20.19.
- npm.
- Un bot de Telegram y su `CHAT_ID`.
- Vercel CLI solo si quieres ejecutar las funciones serverless en local.

## Instalación

```bash
git clone https://github.com/Saaarmyx/NextSteps.git
cd NextSteps
npm install
cp .env.example .env.local
```

Rellena `.env.local`:

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `BOT_TOKEN` | Sí | Token del bot de Telegram. |
| `CHAT_ID` | Sí | Chat o usuario que recibe la confirmación. |
| `SESSION_SECRET` | No | Clave para firmar la sesión. Si se omite, se deriva de `BOT_TOKEN`. |
| `RECIPIENT_NAME` | No | Nombre de la persona destinataria. |
| `ALLOWED_ORIGIN` | No | Origen permitido en los `POST`. |
| `INCLUDE_CLIENT_META` | No | `true` para adjuntar IP y sistema operativo. |

## Uso

```bash
npm run dev        # frontend en http://127.0.0.1:5173
npm run dev:full   # frontend + funciones serverless (requiere vercel login)
npm run test       # pruebas
npm run test:watch # pruebas en modo watch
npm run lint       # ESLint
npm run format     # Prettier
npm run build      # typecheck + build de producción
npm run preview    # previsualiza el build
```

En modo `vite`, las peticiones a `/api` se reenvían a `http://127.0.0.1:3000`, donde `vercel dev` expone las funciones.

### Endpoints

| Ruta | Método | Descripción |
| --- | --- | --- |
| `/api/session` | `GET` | Emite una cookie `HttpOnly` firmada con HMAC-SHA256 (1 hora). |
| `/api/telegram` | `POST` | Valida sesión, origen y cuerpo, y envía el mensaje a Telegram. |

### Personalización

| Qué | Dónde |
| --- | --- |
| Nombre de la persona | `src/config/site.ts` → `recipientName`. |
| Textos de la interfaz | `src/config/site.ts` → `copy`. |
| Catálogo de planes | `src/data/plans.ts`. |
| Logo y favicon | `public/logo.png` y `public/favico.svg`. |
| Paleta y tipografía | `src/styles/tokens.css`. |

## Estructura del proyecto

```text
NextSteps/
├── api/
│   ├── _lib/
│   │   ├── config.js       # Límites y ventanas de seguridad
│   │   └── security.js     # Sesión, rate limit, origen y saneado
│   ├── session.js          # Cookie de sesión
│   └── telegram.js         # Confirmación a Telegram
├── public/
├── src/
│   ├── components/         # chooser, hero, layout, letter, modal, ui
│   ├── config/site.ts      # Textos y destinatario
│   ├── data/plans.ts       # Catálogo de planes
│   ├── hooks/              # usePlanSelection, useFocusTrap
│   ├── lib/                # api, date, validation
│   ├── styles/             # tokens.css y global.css
│   └── types/
├── tests/                  # Vitest + Testing Library
├── .env.example
├── vercel.json
└── vite.config.ts
```

## Hoja de ruta

- [x] Catálogo de planes y selección accesible.
- [x] Modal de confirmación con fecha, hora y nota.
- [x] Carta final con pétalos.
- [x] Sesión firmada y endpoint de Telegram endurecido.
- [x] Pruebas de validación, API, seguridad y componentes.
- [ ] Añadir rate limit distribuido o reglas en el WAF para despliegues con varias instancias.
- [ ] Probar el flujo completo en un despliegue de producción.
- [ ] Documentar la rotación de `SESSION_SECRET`.
- [ ] Añadir una prueba de extremo a extremo del flujo de confirmación.

## Contribuir

Las mejoras son bienvenidas, sobre todo en accesibilidad y pruebas. Lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de enviar un cambio.

## Seguridad

El proyecto maneja un token de bot y datos de una cita. Si encuentras una forma de saltarte la sesión, el rate limit o la validación, sigue [SECURITY.md](SECURITY.md) y no lo publiques en un issue.

## Licencia

Este proyecto se distribuye bajo **Apache License 2.0** (`Apache-2.0`). Consulta el archivo [LICENSE](LICENSE).

Apache 2.0 permite usar, modificar y redistribuir el software, con o sin fines comerciales, siempre que se conserve el aviso de copyright, se incluya una copia de la licencia y se indiquen los cambios. También incluye una concesión de patentes y requiere conservar los avisos de atribución.

Es un proyecto personal de Santiago Sarmiento. No está afiliado a Nexora ni utiliza su marca.

---

Hecho por Santiago Sarmiento
