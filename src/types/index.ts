/** Plan propuesto en el catálogo. */
export interface Plan {
	/** Identificador estable, usado como clave de React. */
	id: string;
	/** Emoji representativo del plan. */
	emoji: string;
	/** Nombre corto del plan. */
	title: string;
	/** Descripción corta mostrada en la tarjeta. */
	description: string;
	/** Marca los planes que todavía no se pueden hacer (idea a futuro). */
	future?: boolean;
}

/** Datos que la persona escribe en el modal de confirmación. */
export interface PlanDetails {
	/** Fecha en formato ISO `YYYY-MM-DD`. */
	date: string;
	/** Hora en formato `HH:MM`. */
	time: string;
	/** Nota opcional para la persona destinataria. */
	note: string;
}

/** Cuerpo de la petición enviada al endpoint de confirmación. */
export interface ConfirmationPayload extends PlanDetails {
	emoji: string;
	title: string;
	description: string;
}

/** Fases del flujo de la aplicación. */
export type AppPhase = 'choosing' | 'letter';

/** Estado del envío de la confirmación. */
export type SubmissionStatus = 'idle' | 'submitting' | 'error';

/** Resultado de validar los datos del modal. */
export interface ValidationResult {
	valid: boolean;
	/** Campo al que pertenece el error, si aplica. */
	field?: 'date' | 'time';
	/** Mensaje legible para la persona usuaria. */
	message?: string;
}
