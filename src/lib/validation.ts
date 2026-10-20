import type { PlanDetails, ValidationResult } from '../types';
import { getTodayISODate, isValidISODate, isValidTime } from './date';

/**
 * Valida la fecha y la hora capturadas en el modal.
 *
 * @param details Datos capturados.
 * @param today Fecha de referencia en formato ISO. Por defecto, hoy.
 */
export function validatePlanDetails(
	details: Pick<PlanDetails, 'date' | 'time'>,
	today: string = getTodayISODate()
): ValidationResult {
	const { date, time } = details;

	if (!date) {
		return { valid: false, field: 'date', message: 'La fecha es obligatoria.' };
	}

	if (!time) {
		return { valid: false, field: 'time', message: 'La hora es obligatoria.' };
	}

	if (!isValidISODate(date)) {
		return { valid: false, field: 'date', message: 'La fecha no es válida.' };
	}

	if (!isValidTime(time)) {
		return { valid: false, field: 'time', message: 'La hora no es válida.' };
	}

	if (date < today) {
		return { valid: false, field: 'date', message: 'La fecha debe ser a partir de hoy.' };
	}

	return { valid: true };
}

/** Elimina caracteres de control (saltos de línea, tabulaciones, etc.). */
// eslint-disable-next-line no-control-regex -- los caracteres de control se eliminan a propósito
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

/** Recorta la nota y elimina caracteres de control que rompen el formato del mensaje. */
export function sanitizeNote(note: string, maxLength = 150): string {
	return note.replace(CONTROL_CHARS, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}
