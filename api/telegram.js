import { LIMITS } from './_lib/config.js';
import {
	checkRateLimit,
	detectOS,
	getClientIp,
	getSessionSecret,
	isAllowedOrigin,
	readSessionCookie,
	verifySession
} from './_lib/security.js';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

/** Valida y normaliza el cuerpo de la petición. */
function parsePayload(body) {
	const { emoji, title, description, date, time, note } = body ?? {};

	if (typeof emoji !== 'string' || !emoji.trim()) return null;
	if (typeof title !== 'string' || !title.trim()) return null;
	if (typeof description !== 'string') return null;
	if (typeof date !== 'string' || !DATE_PATTERN.test(date)) return null;
	if (typeof time !== 'string' || !TIME_PATTERN.test(time)) return null;

	if (emoji.length > LIMITS.emojiMaxLength) return null;
	if (title.length > LIMITS.titleMaxLength) return null;
	if (description.length > LIMITS.descriptionMaxLength) return null;
	if (date.length > LIMITS.dateMaxLength) return null;
	if (time.length > LIMITS.timeMaxLength) return null;

	const cleanNote =
		typeof note === 'string'
			? note.replace(CONTROL_CHARS, ' ').replace(/\s+/g, ' ').trim().slice(0, LIMITS.noteMaxLength)
			: '';

	if (typeof note === 'string' && note.length > LIMITS.noteMaxLength) return null;

	return {
		emoji: emoji.replace(CONTROL_CHARS, '').trim(),
		title: title.replace(CONTROL_CHARS, ' ').replace(/\s+/g, ' ').trim(),
		description: description.replace(CONTROL_CHARS, ' ').replace(/\s+/g, ' ').trim(),
		date,
		time,
		note: cleanNote
	};
}

/** Construye el mensaje de Telegram. */
function buildMessage({ emoji, title, description, date, time, note }, { recipient, meta }) {
	const recipientName = recipient?.trim();
	const lines = [
		'💌 ¡Nueva salida confirmada! ❤️',
		'━━━━━━━━━━━━━━━━━━',
		`📍 Plan: ${emoji} ${title}`,
		`📝 Descripción: ${description}`
	];

	if (recipientName) lines.push(`👤 Para: ${recipientName}`);

	lines.push(
		'━━━━━━━━━━━━━━━━━━',
		'📅 PLANIFICACIÓN:',
		`📆 Fecha: ${date}`,
		`⏰ Hora sugerida: ${time}`,
		`💬 Nota: ${note ? `"${note}"` : 'Sin comentarios.'}`,
		'━━━━━━━━━━━━━━━━━━'
	);

	if (meta) {
		lines.push(
			'⚙️ Detalles del sistema:',
			`🕒 Enviado: ${meta.sentAt}`,
			`🌐 IP: ${meta.ip}`,
			`💻 OS: ${meta.os}`,
			'━━━━━━━━━━━━━━━━━━'
		);
	}

	lines.push('❤️ ¡Ya puedes empezar a preparar todo!');

	return lines.join('\n');
}

/**
 * Recibe la confirmación de la salida y la envía a Telegram.
 *
 * Protecciones: sesión firmada, origen permitido, límite por IP y
 * validación estricta del cuerpo.
 */
export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ success: false, message: 'Método no permitido.' });
	}

	const secret = getSessionSecret();
	const session = verifySession(readSessionCookie(req), secret);
	if (!session) {
		return res.status(401).json({
			success: false,
			message: 'La sesión no es válida o expiró. Recarga la página e inténtalo de nuevo.'
		});
	}

	if (!isAllowedOrigin(req)) {
		return res.status(403).json({ success: false, message: 'Origen no permitido.' });
	}

	const ip = getClientIp(req);
	const withinLimit = checkRateLimit(ip, {
		windowMs: LIMITS.rateWindowMs,
		max: LIMITS.rateMaxRequests
	});

	if (!withinLimit) {
		return res.status(429).json({
			success: false,
			message: 'Demasiados envíos seguidos. Espera unos minutos e inténtalo de nuevo.'
		});
	}

	const { BOT_TOKEN, CHAT_ID } = process.env;
	if (!BOT_TOKEN || !CHAT_ID) {
		console.error('Faltan las variables de entorno BOT_TOKEN o CHAT_ID.');
		return res.status(500).json({
			success: false,
			message: 'El servidor no está configurado correctamente.'
		});
	}

	const payload = parsePayload(req.body);
	if (!payload) {
		return res.status(400).json({ success: false, message: 'Información inválida o incompleta.' });
	}

	const includeMeta = process.env.INCLUDE_CLIENT_META === 'true';
	const message = buildMessage(payload, {
		recipient: process.env.RECIPIENT_NAME,
		meta: includeMeta
			? {
					ip,
					os: detectOS(req.headers['user-agent'] || ''),
					sentAt: new Date().toLocaleString('es-CO', {
						dateStyle: 'full',
						timeStyle: 'short',
						timeZone: 'America/Bogota'
					})
				}
			: null
	});

	try {
		// `TELEGRAM_API_BASE` permite apuntar a un mock en pruebas.
		const apiBase = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org';
		const response = await fetch(`${apiBase}/bot${BOT_TOKEN}/sendMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
			signal: AbortSignal.timeout(LIMITS.telegramTimeoutMs)
		});

		if (!response.ok) {
			const errorBody = await response.text().catch(() => '');
			console.error('Telegram respondió con error:', response.status, errorBody);
			return res.status(502).json({
				success: false,
				message: 'No se pudo entregar la confirmación. Inténtalo de nuevo en un momento.'
			});
		}

		return res.status(200).json({ success: true });
	} catch (error) {
		console.error('Error en /api/telegram:', error);
		return res.status(502).json({
			success: false,
			message: 'No se pudo entregar la confirmación. Inténtalo de nuevo en un momento.'
		});
	}
}
