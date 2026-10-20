/** Fecha de hoy en formato ISO `YYYY-MM-DD` (hora local del navegador). */
export function getTodayISODate(now: Date = new Date()): string {
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

/** `true` si el valor tiene forma de fecha ISO válida y real. */
export function isValidISODate(value: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

	const [year, month, day] = value.split('-').map(Number) as [number, number, number];
	const date = new Date(year, month - 1, day);

	return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

/** `true` si el valor tiene forma de hora válida `HH:MM`. */
export function isValidTime(value: string): boolean {
	if (!/^\d{2}:\d{2}$/.test(value)) return false;

	const [hours, minutes] = value.split(':').map(Number) as [number, number];
	return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}
