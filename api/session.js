import { LIMITS, SESSION_COOKIE } from './_lib/config.js';
import { getClientIp, getSessionSecret, hashClientIp, signSession } from './_lib/security.js';

/**
 * Emite una cookie de sesión firmada.
 *
 * El endpoint de confirmación exige esa cookie: un `POST` aislado no es
 * suficiente para usar el bot de Telegram.
 */
export default async function handler(req, res) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET');
		return res.status(405).json({ success: false, message: 'Método no permitido.' });
	}

	const secret = getSessionSecret();
	if (!secret) {
		console.error('Faltan BOT_TOKEN o SESSION_SECRET: no se puede firmar la sesión.');
		return res.status(500).json({
			success: false,
			message: 'El servidor no está configurado correctamente.'
		});
	}

	const now = Date.now();
	const payload = {
		sub: hashClientIp(getClientIp(req)),
		iat: now,
		exp: now + LIMITS.sessionTtlMs
	};

	const isProduction =
		process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

	const attributes = [
		`${SESSION_COOKIE}=${signSession(payload, secret)}`,
		'HttpOnly',
		'SameSite=Lax',
		'Path=/',
		`Max-Age=${Math.floor(LIMITS.sessionTtlMs / 1000)}`
	];

	if (isProduction) attributes.push('Secure');

	res.setHeader('Set-Cookie', attributes.join('; '));
	res.setHeader('Cache-Control', 'no-store');

	return res.status(200).json({ success: true });
}
