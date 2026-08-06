# Elección Romántica

Una experiencia web interactiva, romántica y minimalista donde los usuarios eligen su próxima cita entre 12 planes, confirman la selección a través de un ritual de confirmación con modal y spinner, y reciben una carta final personalizada. Al confirmar la elección, un endpoint serverless envía una notificación privada a Telegram manteniendo las credenciales protegidas de forma segura en el backend.

## Estructura del proyecto

```
/
├── index.html
├── style.css
├── script.js
├── package.json
├── README.md
└── api/
    └── telegram.js

```

Todos los componentes de la interfaz se encuentran separados en sus respectivos archivos (`index.html`, `style.css` y `script.js`), manteniendo una arquitectura limpia sin dependencias de frameworks externos.

## Cómo funciona

1. **Elección**: El usuario selecciona una de las 12 tarjetas interactivas mediante clics o navegación por teclado. La tarjeta seleccionada se ilumina con un sello animado y habilita la barra de confirmación.
2. **Confirmación con pausa**: Al pulsar el botón de confirmación se despliega un modal centrado con fondo desenfocado para validar la decisión antes de proceder al envío.
3. **Envío seguro**: Al confirmar la elección, el botón se desactiva temporalmente, se activa un indicador de carga (spinner) y se realiza una petición `POST` al endpoint `/api/telegram` enviando los datos del plan (`emoji`, `title` y `description`).
4. **Resultado**:

- **Éxito**: Las opciones se desvanecen, se despliegan efectos visuales de pétalos animados y se revela una carta elegante con el mensaje final. La elección se almacena localmente mediante `localStorage` para persistir el estado ante recargas de página.
- **Error**: El modal muestra una advertencia y el botón se reactiva para permitir un nuevo intento.

## Variables de entorno

El endpoint `/api/telegram` requiere dos variables de entorno configuradas en el servidor para proteger el token:

| Variable    | Descripción                                              |
| ----------- | -------------------------------------------------------- |
| `BOT_TOKEN` | Token del bot de Telegram obtenido a través de BotFather |
| `CHAT_ID`   | ID del chat o usuario destinatario de la notificación    |

### Cómo configurarlas

1. Crear un bot en Telegram a través de [@BotFather](https://t.me/BotFather) utilizando el comando `/newbot` para obtener el token.
2. Iniciar una conversación con el bot creado para registrar el chat activo.
3. Consultar la URL `[https://api.telegram.org/bot](https://api.telegram.org/bot)<TU_TOKEN>/getUpdates` para extraer el valor numérico del campo `chat.id`.

## Desarrollo local

```bash
npm install -g vercel   # en caso de no tener la CLI instalada globalmente
vercel dev

```

Crear un archivo `.env.local` en la raíz del directorio con la siguiente estructura:

```
BOT_TOKEN=tu_token_aqui
CHAT_ID=tu_chat_id_aqui

```

## Características técnicas y de accesibilidad

- **Accesibilidad (a11y)**: Tarjetas totalmente navegables por teclado mediante atributos `tabindex`, `role="button"` y estados `aria-pressed`.
- **Rendimiento y adaptabilidad**: Soporte completo para la media query `prefers-reduced-motion` para desactivar efectos visuales según las preferencias del sistema operativo.
- **Vanilla Stack**: Desarrollado exclusivamente con HTML5, CSS3 y JavaScript moderno en el frontend, respaldado por una función serverless de Node.js en el backend.
