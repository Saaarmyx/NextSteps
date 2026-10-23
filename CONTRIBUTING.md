# Contribuir a NextSteps

Gracias por el interés. NextSteps es un proyecto personal con una historia muy concreta, pero las mejoras de accesibilidad, pruebas y seguridad son bienvenidas.

## Antes de empezar

Si el cambio es grande (otro canal de notificación, una capa de persistencia o un rediseño del flujo), abre primero un issue. Para corregir un texto, una validación o una prueba, puedes enviar el Pull Request directamente.

No incluyas datos reales de personas, tokens de bot ni capturas con conversaciones en issues o PR.

## Flujo de trabajo

1. Haz un fork del repositorio.
2. Crea una rama desde `main`:

   ```bash
   git checkout -b fix/validacion-fecha
   ```

   Usa prefijos `feat/`, `fix/` o `docs/` y nombres en kebab-case.

3. Haz commits atómicos con [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/):

   ```text
   feat(api): añade un límite por sesión además de por IP
   fix(modal): devuelve el foco al botón de origen
   docs(readme): documenta el rate limit
   ```

4. Abre un Pull Request contra `main` explicando qué cambia y cómo lo probaste.

## Entorno de desarrollo

```bash
git clone https://github.com/Saaarmyx/NextSteps.git
cd NextSteps
npm install
cp .env.example .env.local
```

Necesitas `BOT_TOKEN` y `CHAT_ID` para probar el envío real. Para el resto del flujo puedes usar valores de prueba y el modo local.

```bash
npm run dev        # frontend en http://127.0.0.1:5173
npm run dev:full   # frontend + API con vercel dev
npm run test       # Vitest
npm run lint       # ESLint
npm run format:check
npm run build
```

## Estándares de código

- **TypeScript** en modo estricto, sin `any` innecesarios.
- **ESLint** con las reglas de `eslint.config.js`; `npm run lint` debe pasar.
- **Prettier** con `prettier.config.js`; usa `npm run format` antes de enviar.
- **Tests** con Vitest y Testing Library. Un cambio de comportamiento debe traer o ajustar una prueba.
- **Estilos** con CSS Modules y tokens de `src/styles/tokens.css`.
- **Secretos** solo en `.env.local`; nunca en el código ni en el repositorio.
- **API** mantiene la validación de origen, sesión, cuerpo y rate limit; no la relajes sin discutirlo.

## Checklist del Pull Request

- [ ] El cambio está explicado y tiene un caso de uso claro.
- [ ] `npm run test` pasa.
- [ ] `npm run lint` pasa.
- [ ] `npm run format:check` pasa.
- [ ] `npm run build` pasa.
- [ ] Añadí o ajusté pruebas si cambió el comportamiento.
- [ ] No incluí tokens, chats, datos personales ni `.env.local`.
- [ ] Actualicé `README.md` y `CHANGELOG.md` si hace falta.
- [ ] El commit sigue Conventional Commits.

## Proceso de revisión

Reviso los PR cuando puedo, sin plazos fijos. Los cambios que tocan `api/` o la seguridad pueden tardar más porque necesito probarlos con un bot de pruebas. Te responderé en el PR con dudas o cambios solicitados.

## Acuerdo de contribución

No hay CLA. Al enviar una contribución aceptas que se incorpore al proyecto bajo **Apache License 2.0** (`Apache-2.0`), la misma licencia del repositorio.

## Código de conducta

- Respeta a las demás personas y su privacidad.
- Crítica el código, no a quien lo escribió.
- No publiques datos personales, conversaciones ni credenciales.
- No reportes vulnerabilidades en issues públicos.
- Si el proyecto se usa para una sorpresa, no reveles el contenido en un PR público sin avisar.

## Licencia

Las contribuciones quedan bajo **Apache License 2.0** (`Apache-2.0`). Consulta [LICENSE](LICENSE).
