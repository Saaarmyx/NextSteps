import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, requestSession, sendConfirmation } from '../src/lib/api';

const payload = {
	emoji: '☕',
	title: 'Café + charla',
	description: 'Un café tranquilo.',
	date: '2026-10-24',
	time: '18:00',
	note: 'Sin prisa'
};

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('requestSession', () => {
	it('pide la sesión al endpoint correcto', async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
		vi.stubGlobal('fetch', fetchMock);

		await requestSession();

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('/api/session');
		expect(options.credentials).toBe('same-origin');
	});

	it('lanza un error si el servidor responde con fallo', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

		await expect(requestSession()).rejects.toBeInstanceOf(ApiError);
	});
});

describe('sendConfirmation', () => {
	it('envía el payload con las credenciales de la sesión', async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
		vi.stubGlobal('fetch', fetchMock);

		await sendConfirmation(payload);

		const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('/api/telegram');
		expect(options.method).toBe('POST');
		expect(options.credentials).toBe('same-origin');
		expect(JSON.parse(String(options.body))).toEqual(payload);
	});

	it('propaga el mensaje de error del servidor', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: false,
				status: 429,
				json: async () => ({ success: false, message: 'Demasiados envíos seguidos.' })
			})
		);

		await expect(sendConfirmation(payload)).rejects.toThrow('Demasiados envíos seguidos.');
	});

	it('usa un mensaje por defecto si el servidor no devuelve texto', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) })
		);

		await expect(sendConfirmation(payload)).rejects.toThrow(/No se pudo enviar/);
	});
});
