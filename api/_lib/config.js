/** Límites y ventanas de la API. */
export const LIMITS = {
	/** Longitud máxima de la nota. */
	noteMaxLength: 150,
	/** Longitud máxima del título del plan. */
	titleMaxLength: 120,
	/** Longitud máxima de la descripción del plan. */
	descriptionMaxLength: 300,
	/** Longitud máxima del emoji. */
	emojiMaxLength: 16,
	/** Longitud máxima de la fecha (YYYY-MM-DD). */
	dateMaxLength: 10,
	/** Longitud máxima de la hora (HH:MM). */
	timeMaxLength: 5,
	/** Ventana del limitador de peticiones. */
	rateWindowMs: 10 * 60 * 1000,
	/** Peticiones permitidas por ventana y por IP. */
	rateMaxRequests: 5,
	/** Tiempo de vida de la sesión firmada. */
	sessionTtlMs: 60 * 60 * 1000,
	/** Tiempo máximo de espera a Telegram. */
	telegramTimeoutMs: 8000
};

/** Nombre de la cookie de sesión. */
export const SESSION_COOKIE = 'dp_session';
