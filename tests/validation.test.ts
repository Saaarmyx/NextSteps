import { describe, expect, it } from 'vitest';
import { sanitizeNote, validatePlanDetails } from '../src/lib/validation';

const TODAY = '2026-10-20';

describe('validatePlanDetails', () => {
	it('exige la fecha', () => {
		const result = validatePlanDetails({ date: '', time: '18:00' }, TODAY);
		expect(result.valid).toBe(false);
		expect(result.field).toBe('date');
	});

	it('exige la hora', () => {
		const result = validatePlanDetails({ date: '2026-10-21', time: '' }, TODAY);
		expect(result.valid).toBe(false);
		expect(result.field).toBe('time');
	});

	it('rechaza fechas pasadas', () => {
		const result = validatePlanDetails({ date: '2026-10-19', time: '18:00' }, TODAY);
		expect(result.valid).toBe(false);
		expect(result.field).toBe('date');
	});

	it('acepta el día de hoy', () => {
		expect(validatePlanDetails({ date: TODAY, time: '18:00' }, TODAY).valid).toBe(true);
	});

	it('acepta fechas futuras', () => {
		expect(validatePlanDetails({ date: '2026-12-24', time: '20:30' }, TODAY).valid).toBe(true);
	});

	it('rechaza formatos inválidos', () => {
		expect(validatePlanDetails({ date: 'no-date', time: '18:00' }, TODAY).valid).toBe(false);
		expect(validatePlanDetails({ date: '2026-10-21', time: '99:99' }, TODAY).valid).toBe(false);
	});
});

describe('sanitizeNote', () => {
	it('elimina saltos de línea y caracteres de control', () => {
		expect(sanitizeNote('hola\nmundo\u0007')).toBe('hola mundo');
	});

	it('recorta al máximo permitido', () => {
		expect(sanitizeNote('a'.repeat(300)).length).toBe(150);
	});
});
