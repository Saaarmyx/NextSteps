<picture>
 <a href="/">
  <img src="assets/Saaarmyx-Github.svg" alt="NextSteps Preview" style="border-radius: 20px;" width="100%" />
  </a>
</picture>

---

<h1 align="center">Bienvenido a NextSteps</h1>

Planificador de salidas: elige un plan, propón fecha y hora, y recibe la confirmación por Telegram.

Para aprender más sobre el uso del proyecto, visita la [documentación oficial]().

## Tabla de Contenidos

- [Estado del proyecto](#estado-del-proyecto)
- [Descripción](#descripción)
- [Características principales](#características-principales)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Primeros Pasos](#primeros-pasos)
  - [Guía de Inicio Rápido](#guía-de-inicio-rápido)
  - [Guía de Desarrollo](#guía-de-desarrollo)

## Estado del proyecto

> **Estado actual:** Activo

## Descripción

NextSteps nació como una sorpresa: una web donde la otra persona elige el plan de la próxima salida y lo confirma con fecha y hora. Quería que la experiencia se sintiera cuidada —jardín, pétalos, carta final— sin exponer el token del bot en el navegador.

La app es una SPA de React con una función serverless en Vercel. El frontend valida la selección, pide una sesión firmada y envía la confirmación a `/api/telegram`. El token y el chat ID viven solo en el servidor.

## Características principales

- Catálogo de planes con emoji, título, descripción y planes futuros.
- Selección accesible con teclado y lector de pantalla.
- Modal de confirmación con fecha, hora y nota opcional.
- Carta final con pétalos y opción de elegir otro plan.
- Endpoint `/api/session` con cookie `HttpOnly` firmada con HMAC-SHA256.
- Endpoint `/api/telegram` con validación de sesión, origen, cuerpo y rate limit.
- Pruebas con Vitest, Testing Library y jsdom.

## Estructura del proyecto

```text
NextSteps/
├── api/                    # Funciones serverless
├── public/                 # Assets estáticos
├── src/
│   ├── components/         # chooser, hero, layout, letter, modal, ui
│   ├── config/site.ts      # Textos y destinatario
│   ├── data/plans.ts       # Catálogo de planes
│   ├── hooks/              # usePlanSelection, useFocusTrap
│   ├── lib/                # api, date, validation
│   ├── styles/             # tokens.css y global.css
│   └── types/
├── tests/                  # Vitest + Testing Library
├── CHANGELOG.md          # Historial de cambios
├── LICENSE               # Licencia
└── README.md             # Documentación principal
```

## Primeros Pasos

Clona este repositorio y configura el entorno inicial ejecutando los siguientes comandos:

```bash
# 1. Clona el repositorio
git clone https://github.com/Saaarmyx/NextSteps.git

# 2. Entra al directorio
cd NextSteps
```

### Guía de Inicio Rápido

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Configurar variables de entorno**

   Copia el archivo de ejemplo y completa los valores:

   ```bash
   cp .env.example .env.local
   ```

3. **Ejecutar el proyecto**

   ```bash
   npm run dev
   ```

### Guía de Desarrollo

Para contribuir al código del proyecto:

1. Crea una rama para tu cambio:

   ```bash
   git checkout -b nombre-de-la-rama
   ```

2. Realiza tus cambios y commitea:

   ```bash
   git commit -m "Descripción breve del cambio"
   ```

3. Sube los cambios:

   ```bash
   git push origin nombre-de-la-rama
   ```

---

<p align="center">
  Desarrollado por <strong>Saaarmyx</strong>.
</p>
