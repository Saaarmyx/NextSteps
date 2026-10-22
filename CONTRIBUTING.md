# Guía de Contribución — NextSteps (Planificador de Salidas)

Gracias por querer contribuir a NextSteps. Esta guía cubre el flujo de trabajo, estándares TypeScript/React y cómo proponer cambios.

---

## 🔀 Flujo de Trabajo

### 1. Fork y Rama

```bash
# 1. Fork en GitHub
# 2. Clona TU fork
git clone https://github.com/TU-USUARIO/Saaarmyx.git
cd Saaarmyx/NextSteps

# 3. Añade upstream
git remote add upstream https://github.com/Saaarmyx/Saaarmyx.git

# 4. Rama desde main
git checkout main
git pull upstream main
git checkout -b feature/mi-mejora   # o fix/, refactor/, docs/, style/, build/, ci/, test/
```

> **Convención**: `feature/`, `fix/`, `refactor/`, `docs/`, `style/`, `build/`, `ci/`, `test/` + `kebab-case`.  
> Ejemplos: `feature/plan-sharing`, `fix/telegram-rate-limit`, `docs/api-session-endpoint`.

### 2. Commits — Conventional Commits

```text
<tipo>(<ámbito>): <descripción en imperativo y minúsculas>
```

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad (componente, página, endpoint, hook) |
| `fix` | Corrección de bug |
| `refactor` | Reestructuración sin cambio de comportamiento |
| `perf` | Mejora de rendimiento medible |
| `style` | Formato (Prettier), sin lógica |
| `docs` | Documentación (README, TSDoc, comentarios) |
| `build` | `vite.config.ts`, `tsconfig.json`, `package.json`, `vercel.json` |
| `ci` | GitHub Actions, workflows |
| `test` | Pruebas (Vitest, Testing Library) |
| `revert` | Revierte commit anterior |

**Ámbitos NextSteps**: `components`, `pages`, `api`, `hooks`, `config`, `data`, `styles`, `types`.

```bash
git add src/components/chooser/PlanCard.tsx src/hooks/usePlanSelection.ts
git commit -m "feat(components): añade selección múltiple de planes"
```

**Reglas**: Un commit = un cambio atómico. `git add <rutas-explicitas>`. Mensaje español, imperativo, minúsculas, ≤ 72 chars.

### 3. Push y Pull Request

```bash
git push origin feature/mi-mejora
```

Abre PR hacia `Saaarmyx/Saaarmyx:main` (carpeta `NextSteps/`).

**Checklist Pre-PR**:
- [ ] `main` actualizado y rebaseado
- [ ] Commits atómicos + Conventional Commits
- [ ] `npm run verify` pasa (`lint` + `build`)
- [ ] `npm run test` pasa (Vitest)
- [ ] `npm run format:check` pasa (Prettier)
- [ ] TSDoc actualizado en funciones/componentes exportados
- [ ] README actualizado si cambia API, config o variables de entorno
- [ ] Sin `node_modules`, `dist`, `.vercel`, `.local`, logs en diff
- [ ] PR explica **qué y por qué**

---

## 📦 Estándares TypeScript / React / Vite

| Aspecto | Estándar |
|---------|----------|
| **TypeScript** | 6.x, `strict: true`, `noUncheckedIndexedAccess: true` |
| **React** | 19.x, Functional Components + Hooks, **sin Class Components** |
| **Formato** | `prettier --write` (config `prettier.config.js`) |
| **Lint** | `eslint` + `typescript-eslint` + `eslint-plugin-react-hooks` |
| **Bundler** | Vite 8.x + `@vitejs/plugin-react` |
| **Testing** | Vitest 5.x + `@testing-library/react` + `jsdom` |
| **CSS** | CSS Modules (`*.module.css`) + Design Tokens en `src/styles/tokens.css` |
| **Serverless** | Vercel Functions en `api/` (Node.js runtime) |
| **Rutas** | React Router 7 (declarativo en `App.jsx`) |

### Estructura de Código

```
NextSteps/
├── api/                      # Vercel Serverless Functions
│   ├── _lib/
│   │   ├── config.js         # Límites, ventanas de seguridad
│   │   └── security.js       # Sesión HMAC, rate limit, origen, saneado
│   ├── session.js            # GET /api/session → cookie HttpOnly firmada
│   └── telegram.js           # POST /api/telegram → valida + envía a Telegram
├── public/                   # Assets estáticos (favicon, logo)
├── src/
│   ├── components/           # Organismos reutilizables
│   │   ├── chooser/          # PlanGrid, PlanCard, ConfirmBar
│   │   ├── hero/             # Hero, marca
│   │   ├── layout/           # GardenBackground, Petals, Footer
│   │   ├── letter/           # Carta final
│   │   ├── modal/            # ConfirmModal (focus trap, ARIA)
│   │   └── ui/               # Button (átomo)
│   ├── config/
│   │   └── site.ts           # Textos UI + recipientName
│   ├── data/
│   │   └── plans.ts          # Catálogo de planes (tipado estricto)
│   ├── hooks/
│   │   ├── usePlanSelection.ts  # Estado + validación + envío
│   │   └── useFocusTrap.ts      # Focus trap para modal
│   ├── lib/
│   │   ├── api.ts          # Cliente fetch tipado (/api/*)
│   │   ├── date.ts         # Utilidades fecha/hora
│   │   └── validation.ts   # Esquemas Zod-like manuales
│   ├── styles/
│   │   ├── tokens.css      # Design tokens (colores, spacing, radius)
│   │   └── global.css      # Reset + base + utilidades
│   ├── types/              # Tipos compartidos (Plan, PlanSelection, ApiResponse)
│   ├── main.tsx            # Bootstrap: StrictMode + Analytics + Router
│   └── App.tsx             # Router + Layout + 404
├── tests/                    # Pruebas unitarias y de componentes
├── index.html
├── vite.config.ts
├── vercel.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.test.json
├── .oxlintrc.json
├── prettier.config.js
├── eslint.config.js
├── LICENSE (Apache-2.0)
└── README.md
```

### Convenciones de Código

- **TSDoc** en todos los `export` (componentes, hooks, utils, types).
- **Tipado estricto**: evita `any`; usa `unknown` + type guards si hace falta.
- **Componentes**: un archivo = un componente; co-loca `.module.css` y `.tsx`.
- **Hooks**: prefijo `use`, retornan tupla `[state, actions]` o objeto `{ state, actions }`.
- **API client**: `src/lib/api.ts` centraliza `fetch` con tipado de respuesta.
- **Validación**: schemas en `src/lib/validation.ts` (sin Zod, implementación propia ligera).
- **Accesibilidad**: obligatoria (ARIA, focus trap, keyboard nav, `prefers-reduced-motion`).
- **Seguridad**: toda petición `POST` a `/api/telegram` requiere cookie de sesión válida (HMAC-SHA256, 1h TTL).
- **Rate limit**: 5 req/IP/10min en memoria (documentado para WAF en producción).

### Ejemplo TSDoc

```ts
/**
 * Hook para gestionar selección de plan, validación y envío a Telegram.
 * @returns Estado y acciones: { selectedPlan, isModalOpen, openModal, submit }
 */
export function usePlanSelection(): UsePlanSelectionReturn { ... }
```

---

## 🔐 Variables de Entorno

Copia `.env.example` a `.env.local` (ver abajo). **Nunca commits `.env.local`**.

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `BOT_TOKEN` | Sí | Token de BotFather (Telegram) |
| `CHAT_ID` | Sí | Chat ID destino (usuario/grupo) |
| `SESSION_SECRET` | No | Clave HMAC (si omitida, deriva de BOT_TOKEN) |
| `RECIPIENT_NAME` | No | Nombre destinatario (genérico si omitido) |
| `ALLOWED_ORIGIN` | No | Origen permitido para POST (CORS estricto) |
| `INCLUDE_CLIENT_META` | No | `true` para adjuntar IP/OS al mensaje |

---

## 🧪 Desarrollo Local

```bash
# Instalar
npm install

# Solo frontend (proxy a vercel dev en puerto 3000)
npm run dev           # http://127.0.0.1:5173

# Frontend + Functions (requiere vercel login)
npm run dev:full      # vercel dev expone api/ en :3000

# Calidad
npm run lint          # ESLint
npm run format        # Prettier --write
npm run format:check  # Prettier --check
npm run test          # Vitest run
npm run build         # tsc -b + vite build
npm run verify        # lint + build (gate de CI)
```

---

## 🐛 Reportar Issues

Incluye:
- Versión/commit (`git rev-parse --short HEAD`)
- Node (`node --version`), npm (`npm --version`)
- Navegador y OS
- Pasos para reproducir
- Logs de consola (frontend + `vercel dev` si aplica)
- Payload de red (Network tab) si falla `/api/telegram`

---

## 🔒 Seguridad

- **Nunca** subas `.env.local`, `BOT_TOKEN`, `SESSION_SECRET`.
- Si expusiste `BOT_TOKEN`: revócalo en @BotFather y genera otro.
- Reporta vulnerabilidades **privadamente** (GitHub Security Advisories).

---

## 📜 Licencia de Contribuciones

Al enviar PR, aceptas que tu código se licencie bajo **Apache-2.0** (misma licencia del proyecto). Ver [LICENSE](./LICENSE).

---

## 🤔 Dudas

- GitHub Discussions para diseño/arquitectura.
- Discord `saaarmyx` o @saaarmyx en GitHub.