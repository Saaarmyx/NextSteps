/**
 * Configuración central de la experiencia.
 *
 * Todo el texto visible vive aquí para poder personalizar la aplicación
 * sin tocar los componentes.
 */

/** Nombre de la persona destinataria. Déjalo vacío para usar textos genéricos. */
export const recipientName = '';

/** Nombre de la aplicación (usado en `document.title`). */
export const appName = 'Planificador de Salidas';

/** texts de la experiencia. */
export const copy = {
	eyebrow: 'Una pequeña sorpresa para ti',
	heroLead:
		'Preparé algunas ideas para nuestra próxima salida. Solo elige la que más te emocione, ' +
		'y yo me encargo del resto. Porque, al final, el mejor plan siempre es contigo.',
	sectionTitle: 'muchos planes, una respuesta',
	sectionSub: 'tú eliges la siguiente salida',
	confirmTitle: 'Plan elegido',
	confirmCta: '🖤 Confirmar mi elección',
	modalTitle: '¿Seguro que esta será nuestra próxima aventura?',
	modalDateLabel: '¿Qué día te gustaría que hiciéramos este plan?',
	modalTimeLabel: '¿A qué hora te gustaría?',
	modalNoteLabel: '¿Quieres decirme algo para ese día? (Opcional)',
	modalNotePlaceholder: 'Escribe algo si quieres...',
	modalCancel: 'Cancelar',
	modalConfirm: 'Confirmar 🖤',
	modalMissingDetails: 'Por favor selecciona la fecha y la hora antes de confirmar.',
	modalPastDate: 'Por favor elige una fecha a partir de hoy.',
	modalNoPlan: 'Selecciona primero un plan.',
	modalSendError: 'Algo salió mal enviando tu elección. Inténtalo de nuevo en un momento.',
	modalMissingSession:
		'No pudimos preparar el envío. Revisa tu conexión e inténtalo de nuevo en un momento.',
	letter: {
		title: 'Excelente elección',
		lines: [
			'Tu decisión quedó guardada',
			'Gracias por elegir compartir ese momento conmigo',
			'Te quiero muchísimo 🖤'
		],
		restart: '🌸 Elegir otro plan',
		close: '🌸 Nos vemos pronto'
	},
	footer: 'Hecho con cariño 🖤',
	futureBadge: 'Futuro'
} as const;

/** Prefijo de saludo. Vacío si todavía no se ha configurado un nombre. */
export function greeting(name: string = recipientName): string {
	const clean = name.trim();
	return clean.length > 0 ? `${clean}, ` : '';
}
