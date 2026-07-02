import type { ConfirmationPayload } from '../types';

/** Rutas de la API del proyecto. */
export const API_ROUTES = {
	session: '/api/session',
	confirmation: '/api/telegram'
} as const;

/** Error de negocio con el mensaje que la interfaz debe mostrar. */
export class ApiError extends Error {
	readonly status: number;

	constructor(message: string, status = 500) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
	}
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
	return response.json().catch(() => ({}));
}

/**
 * Pide al servidor una sesión firmada (cookie `HttpOnly`).
 *
 * El endpoint de confirmación exige esa cookie, de modo que un `POST` aislado
 * no suffit para abusar del bot de Telegram.
 */
export async function requestSession(signal?: AbortSignal): Promise<void> {
	const response = await fetch(API_ROUTES.session, {
		method: 'GET',
		credentials: 'same-origin',
		signal
	});

	if (!response.ok) {
		throw new ApiError('No se pudo iniciar la sesión de envío.', response.status);
	}
}

/**
 * Envía la confirmación de la salida elegida.
 *
 * @throws {ApiError} Si el servidor responde con error.
 */
export async function sendConfirmation(
	payload: ConfirmationPayload,
	signal?: AbortSignal
): Promise<void> {
	const response = await fetch(API_ROUTES.confirmation, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'same-origin',
		body: JSON.stringify(payload),
		signal
	});

	if (!response.ok) {
		const data = await readJson(response);
		const message = typeof data.message === 'string' ? data.message : '';
		throw new ApiError(message || 'No se pudo enviar la confirmación.', response.status);
	}
}
