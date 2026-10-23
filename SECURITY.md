# Seguridad de NextSteps

NextSteps maneja un token de bot, un chat ID y los datos de una cita (fecha, hora y nota). Cualquier fallo que permita saltarse la sesión, el rate limit, la validación o el origen se trata como un problema de seguridad.

## Versiones soportadas

La versión declarada en `package.json` es `2.0.0`. El repositorio no tiene tags, así que se mantiene la última revisión de `main`.

| Versión | Soporte |
| --- | --- |
| `2.0.0` (última revisión de `main`) | Sí |
| Versiones anteriores | No |

## Cómo reportar una vulnerabilidad

Usa el **reporte privado de GitHub**:

1. Entra en la pestaña **Security** del repositorio.
2. Pulsa **Report a vulnerability**.
3. Rellena el formulario con el detalle indicado abajo.

Si el reporte privado no está habilitado, contacta conmigo desde mi perfil de GitHub: [github.com/Saaarmyx](https://github.com/Saaarmyx).

**No abras un issue público** para reportar una vulnerabilidad. No incluyas tokens reales, IDs de chat ni datos personales en el reporte; usa valores de prueba.

## Qué incluir en el reporte

- Descripción del problema y endpoint afectado.
- Pasos para reproducirlo.
- Impacto: qué se puede leer, enviar o evitar.
- Versión o commit afectado.
- Una propuesta de corrección, si la tienes.

## Tiempos

Es un proyecto personal. Respondo en cuanto puedo, sin plazos garantizados. Confirmaré la recepción y te contaré cómo avanza la revisión.

## Divulgación responsable

Te pido que no divulgues el detalle hasta que exista una corrección desplegada. Si el fallo expone el token del bot o datos de una persona, la prioridad será rotar las credenciales y publicar una mitigación.

## Reconocimiento

Si quieres, te acredito en el CHANGELOG o en la publicación de la corrección. Indica al reportar cómo prefieres aparecer.
