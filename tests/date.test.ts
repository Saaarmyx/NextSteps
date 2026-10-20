import { describe, expect, it } from 'vitest';
import { getTodayISODate, isValidISODate, isValidTime } from '../src/lib/date';

describe('getTodayISODate', () => {
	it('devuelve la fecha en formato ISO', () => {
		expect(getTodayISODate(new Date(2026, 9, 20))).toBe('2026-10-20');
	});

	it('rellena con ceros el mes y el día', () => {
		expect(getTodayISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
	});
});

describe('isValidISODate', () => {
	it('acepta una fecha real', () => {
		expect(isValidISODate('2026-02-28')).toBe(true);
	});

	it('rechaza fechas que no existen', () => {
		expect(isValidISODate('2026-02-30')).toBe(false);
	});

	it('rechaza formatos incorrectos', () => {
		expect(isValidISODate('20/10/2026')).toBe(false);
		expect(isValidISODate('')).toBe(false);
	});
});

describe('isValidTime', () => {
	it('acepta horas válidas', () => {
		expect(isValidTime('18:30')).toBe(true);
		expect(isValidTime('00:00')).toBe(true);
	});

	it('rechaza horas imposibles', () => {
		expect(isValidTime('25:00')).toBe(false);
		expect(isValidTime('10:75')).toBe(false);
		expect(isValidTime('8:30')).toBe(false);
	});
});
