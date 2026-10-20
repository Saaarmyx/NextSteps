import crypto from 'node:crypto';
import { SESSION_COOKIE } from './config.js';

/** IP real del cliente (la primera de `x-forwarded-for`). */
export function getClientIp(req) {
	const forwarded = req.headers['x-forwarded-for'];
	const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
	return (raw || '').split(',')[0].trim() || req.socket?.remoteAddress || 'desconocida';
}

/** Identificador anónimo y estable de la IP (no se guarda la IP en claro). */
export function hashClientIp(ip) {
	return crypto.createHash('sha256').update(`date-planner:${ip}`).digest('hex').slice(0, 32);
}

/**
 * Secreto usado para firmar la sesión.
 * Se usa `SESSION_SECRET` si existe; si no, se deriva de `BOT_TOKEN`.
 */
export function getSessionSecret() {
	const explicit = process.env.SESSION_SECRET?.trim();
	if (explicit) return explicit;

	const token = process.env.BOT_TOKEN;
	if (!token) return null;

	return crypto.createHash('sha256').update(`date-planner:${token}`).digest('hex');
}

/** Firma un payload de sesión con HMAC-SHA256. */
export function signSession(payload, secret) {
	const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
	const mac = crypto.createHmac('sha256', secret).update(body).digest('base64url');
	return `${body}.${mac}`;
}

/** Verifica la firma y la vigencia de una sesión. Devuelve `null` si no es válida. */
export function verifySession(token, secret) {
	if (!token || !secret) return null;

	const [body, mac] = token.split('.');
	if (!body || !mac) return null;

	const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
	const received = Buffer.from(mac);
	const reference = Buffer.from(expected);
	if (received.length !== reference.length || !crypto.timingSafeEqual(received, reference)) {
		return null;
	}

	try {
		const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
		if (!payload?.exp || payload.exp < Date.now()) return null;
		return payload;
	} catch {
		return null;
	}
}

/** Lee una cookie concreta de la petición. */
export function readCookie(req, name) {
	const header = req.headers.cookie;
	if (!header) return null;

	for (const part of header.split(';')) {
		const [key, ...rest] = part.trim().split('=');
		if (key === name) return decodeURIComponent(rest.join('='));
	}

	return null;
}

/** Cookie de sesión de la petición. */
export function readSessionCookie(req) {
	return readCookie(req, SESSION_COOKIE);
}

/** Hostnames que siempre equivalen a la máquina local. */
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0']);

/**
 * Valida el origen de la petición.
 *
 * - Si hay `ALLOWED_ORIGIN` definido, la coincidencia es estricta.
 * - Si no, se compara el *hostname* del origen con el del servidor
 *   (el puerto puede diferir entre el frontend y las funciones serverless).
 * - En desarrollo se acepta cualquier combinación de loopback
 *   (`localhost` frente a `127.0.0.1`), porque ambos son la misma máquina.
 * - Si no hay `Origin` (cliente no navegador) se acepta: la sesión firmada
 *   y el limitador de peticiones son la barrera real.
 */
export function isAllowedOrigin(req) {
	const origin = req.headers.origin;
	if (!origin) return true;

	const allowed = process.env.ALLOWED_ORIGIN?.trim();
	if (allowed) return origin === allowed;

	const forwardedHost = req.headers['x-forwarded-host'];
	const rawHost = (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost)
		?.split(',')[0]
		.trim();
	const host = rawHost || req.headers.host;
	if (!host) return false;

	try {
		const originHost = new URL(origin).hostname;
		const requestHost = new URL(`http://${host}`).hostname;

		if (originHost === requestHost) return true;
		return LOOPBACK_HOSTS.has(originHost) && LOOPBACK_HOSTS.has(requestHost);
	} catch {
		return false;
	}
}

/**
 * Limitador de peticiones en memoria (por instancia).
 * Es una primera barrera: para un despliegue con varias instancias
 * conviene añadir reglas de WAF en la plataforma de hosting.
 */
const buckets = new Map();

export function checkRateLimit(key, { windowMs = 60_000, max = 5 } = {}) {
	const now = Date.now();
	const hits = (buckets.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);

	if (hits.length >= max) {
		buckets.set(key, hits);
		return false;
	}

	hits.push(now);
	buckets.set(key, hits);

	if (buckets.size > 5000) buckets.clear();

	return true;
}

/** Detecta el sistema operativo a partir del user agent. */
export function detectOS(userAgent) {
	const ua = userAgent.toLowerCase();
	if (ua.includes('windows')) return 'Windows';
	if (ua.includes('android')) return 'Android';
	if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) return 'iOS';
	if (ua.includes('mac os')) return 'macOS';
	if (ua.includes('linux')) return 'Linux';
	return 'Desconocido';
}
