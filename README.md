# Planificador de Salidas

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-Apache_2.0-D22128?logo=apache&logoColor=white)
![Node](https://img.shields.io/badge/Node-%3E%3D20.19-5FA04E?logo=node.js)

Experiencia web para elegir una salida entre un catálogo de planes, confirmar la elección con
fecha y hora, y recibir la confirmación en Telegram sin exponer credenciales en el navegador.

---

## Propósito

| Aspecto               | Detalle                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| Responsabilidad única | Frontend React para la experiencia de elección y una función serverless que entrega la confirmación. |
| Integración           | Se despliega como aplicación estática (Vite) + funciones serverless en `api/` sobre Vercel.          |
| Stack                 | React 19, TypeScript 6, Vite 8, Vitest 5, CSS Modules. Sin dependencias de UI de terceros.           |
| Licencia              | Apache License 2.0.                                                                                  |

---

## Estructura del proyecto

```
/
├── api/                       # Funciones serverless (Vercel)
│   ├── _lib/
│   │   ├── config.js          # Límites y ventanas de seguridad
│   │   └── security.js        # Sesión firmada, rate limit, origen y saneado
│   ├── session.js             # Emite la cookie de sesión HttpOnly
│   └── telegram.js            # Recibe la confirmación y la envía a Telegram
├── public/
│   ├── favico.svg             # Favicon (sustituible)
│   └── logo.png               # Logo de la aplicación (sustituible)
├── src/
│   ├── components/
│   │   ├── chooser/           # PlanGrid, PlanCard, ConfirmBar
│   │   ├── hero/              # Hero y marca
│   │   ├── layout/            # GardenBackground, Petals, Footer
│   │   ├── letter/            # Carta final
│   │   ├── modal/             # ConfirmModal
│   │   └── ui/                # Button reutilizable
│   ├── config/site.ts         # Textos y nombre del destinatario
│   ├── data/plans.ts          # Catálogo de planes
│   ├── hooks/                 # usePlanSelection, useFocusTrap
│   ├── lib/                   # api, date, validation
│   ├── styles/                # tokens.css y global.css
│   └── types/                 # Tipos compartidos
├── tests/                     # Pruebas unitarias y de componentes
├── index.html
├── vite.config.ts
└── vercel.json
```

---

## Componentes y flujo

1. **Selección** — `PlanGrid` renderiza el catálogo; `PlanCard` es accesible con teclado
   (`role="button"`, `tabIndex`, `aria-pressed`) y con lector de pantalla (`<ul>`/`<li>`).
2. **Resumen** — `ConfirmBar` muestra emoji, título y descripción del plan elegido.
3. **Confirmación** — `ConfirmModal` pide fecha, hora y una nota opcional.
   `useFocusTrap` mantiene el foco dentro del diálogo, `Escape` cierra y el foco vuelve al
   elemento de origen.
4. **Envío** — `usePlanSelection` valida los datos, pide una sesión firmada y envía el
   payload a `/api/telegram`.
5. **Resultado** — Al confirmarse, el catálogo se desvanece, llueven pétalos y aparece la
   carta final con la opción de elegir otro plan.

### Endpoint de confirmación

| Ruta            | Método | Descripción                                                               |
| --------------- | ------ | ------------------------------------------------------------------------- |
| `/api/session`  | `GET`  | Emite una cookie `HttpOnly` firmada con HMAC-SHA256 (vigencia de 1 hora). |
| `/api/telegram` | `POST` | Valida la sesión, el origen y el cuerpo, y entrega el mensaje a Telegram. |

### Capas de protección

- **Sesión firmada**: `POST` sin cookie válida responde `401`.
- **Origen**: se compara el hostname del `Origin` con el del servidor (`ALLOWED_ORIGIN` fuerza la coincidencia estricta).
- **Rate limit**: 5 envíos por IP cada 10 minutos; el sexto responde `429`.
- **Validación estricta**: longitudes, formatos de fecha y hora y saneado de la nota.
- **Timeout**: la llamada a Telegram se corta a los 8 segundos.
- **Privacidad**: la IP y el sistema operativo solo se incluyen si se define `INCLUDE_CLIENT_META=true`.

> El limitador vive en memoria de cada instancia. Para un despliegue con varias instancias,
> conviene añadir reglas de rate limit en el WAF de la plataforma de hosting.

---

## Variables de entorno

| Variable              | Obligatoria | Descripción                                                             |
| --------------------- | ----------- | ----------------------------------------------------------------------- |
| `BOT_TOKEN`           | Sí          | Token del bot de Telegram ([BotFather](https://t.me/BotFather)).        |
| `CHAT_ID`             | Sí          | ID del chat o usuario que recibe la notificación.                       |
| `SESSION_SECRET`      | No          | Clave para firmar la sesión. Si se omite, se deriva de `BOT_TOKEN`.     |
| `RECIPIENT_NAME`      | No          | Nombre de la persona destinataria. Si se omite, el mensaje es genérico. |
| `ALLOWED_ORIGIN`      | No          | Origen permitido en las peticiones `POST`.                              |
| `INCLUDE_CLIENT_META` | No          | `true` para adjuntar IP y sistema operativo al mensaje.                 |

Copia `.env.example` como `.env.local` en la raíz:

```bash
cp .env.example .env.local
```

---

## Inicio rápido

```tsx
import { usePlanSelection } from './hooks/usePlanSelection';

export function App() {
  const { selectedPlan, isModalOpen, openModal, submit } = usePlanSelection();

  return (
    <>
      <PlanGrid selectedPlan={selectedPlan} onSelect={selectPlan} />
      <ConfirmBar plan={selectedPlan} onConfirm={openModal} />
      <ConfirmModal open={isModalOpen} plan={selectedPlan} onSubmit={submit} />
    </>
  );
}
```

---

## Desarrollo local

```bash
npm install        # instalar dependencias
npm run dev        # frontend en http://127.0.0.1:5173
npm run dev:full   # frontend + funciones serverless (requiere `vercel login`)
```

El frontend envía las peticiones a `/api`; en modo `vite` se reenvían por proxy a
`http://127.0.0.1:3000`, donde `vercel dev` expone las funciones.

### Calidad

```bash
npm run test         # pruebas unitarias y de componentes
npm run lint         # ESLint
npm run format       # Prettier
npm run build        # comprobación de tipos + build de producción
```

---

## Personalización

| Qué                     | Dónde                                                            |
| ----------------------- | ---------------------------------------------------------------- |
| Nombre del destinatario | `src/config/site.ts` → `recipientName` (vacío = texto genérico). |
| Textos de la interfaz   | `src/config/site.ts` → `copy`.                                   |
| Catálogo de planes      | `src/data/plans.ts`.                                             |
| Logo y favicon          | `public/logo.png` y `public/favico.svg`.                         |
| Paleta y tipografía     | `src/styles/tokens.css`.                                         |

---

## Accesibilidad

- Navegación completa por teclado en el catálogo y en el modal.
- Roles y estados ARIA correctos (`aria-pressed`, `aria-modal`, `aria-live`).
- Trampa de foco en el modal y devolución del foco al cerrarlo.
- Soporte de `prefers-reduced-motion` para desactivar animaciones.

---

## Contribución

Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/es/) y son
atómicos: un cambio, un mensaje. Nunca uses `git add .`; agrega rutas explícitas.

```bash
git add src/components/chooser/PlanCard.tsx
git commit -m "fix(chooser): restore focus after card selection"
```
