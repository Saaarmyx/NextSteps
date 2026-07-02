import { describe, expect, it } from 'vitest';
import {
	checkRateLimit,
	hashClientIp,
	isAllowedOrigin,
	signSession,
	verifySession
} from '../api/_lib/security.js';

const SECRET = 'secreto-de-prueba';

describe('sesión firmada', () => {
	it('firma y verifica una sesión vigente', () => {
		const token = signSession({ sub: 'abc', exp: Date.now() + 60_000 }, SECRET);

		expect(verifySession(token, SECRET)?.sub).toBe('abc');
	});

	it('rechaza un token manipulado', () => {
		const token = signSession({ sub: 'abc', exp: Date.now() + 60_000 }, SECRET);
		const [body] = token.split('.');

		expect(verifySession(`${body}.firma-falsa`, SECRET)).toBeNull();
	});

	it('rechaza una sesión expirada', () => {
		const token = signSession({ sub: 'abc', exp: Date.now() - 1 }, SECRET);

		expect(verifySession(token, SECRET)).toBeNull();
	});

	it('rechaza un token firmado con otra clave', () => {
		const token = signSession({ sub: 'abc', exp: Date.now() + 60_000 }, 'otra-clave');

		expect(verifySession(token, SECRET)).toBeNull();
	});

	it('no guarda la IP en claro', () => {
		expect(hashClientIp('192.168.0.1')).not.toContain('192.168.0.1');
		expect(hashClientIp('192.168.0.1')).toBe(hashClientIp('192.168.0.1'));
	});
});

describe('limitador de peticiones', () => {
	it('bloquea cuando se supera el máximo en la ventana', () => {
		const key = `test-${Math.random()}`;
		const options = { windowMs: 60_000, max: 2 };

		expect(checkRateLimit(key, options)).toBe(true);
		expect(checkRateLimit(key, options)).toBe(true);
		expect(checkRateLimit(key, options)).toBe(false);
	});
});

describe('validación de origen', () => {
	it('acepta peticiones sin origen (clientes no navegador)', () => {
		expect(isAllowedOrigin({ headers: {} })).toBe(true);
	});

	it('acepta el origen que coincide con el host', () => {
		const req = { headers: { origin: 'https://ejemplo.com', host: 'ejemplo.com' } };

		expect(isAllowedOrigin(req)).toBe(true);
	});

	it('rechaza un origen ajeno', () => {
		const req = { headers: { origin: 'https://atacante.com', host: 'ejemplo.com' } };

		expect(isAllowedOrigin(req)).toBe(false);
	});

	it('acepta el mismo host con distinto puerto (proxy de desarrollo)', () => {
		const req = { headers: { origin: 'http://127.0.0.1:5173', host: '127.0.0.1:3000' } };

		expect(isAllowedOrigin(req)).toBe(true);
	});

	it('acepta loopback con nombres distintos (localhost frente a 127.0.0.1)', () => {
		const req = { headers: { origin: 'http://127.0.0.1:5173', host: 'localhost:3000' } };

		expect(isAllowedOrigin(req)).toBe(true);
	});
});
