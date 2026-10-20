import { useEffect } from 'react';
import type { Plan, PlanDetails, SubmissionStatus } from '../../types';
import { copy } from '../../config/site';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Button } from '../ui/Button';
import styles from './ConfirmModal.module.css';

/** Longitud máxima de la nota. */
export const NOTE_MAX_LENGTH = 150;

interface ConfirmModalProps {
	/** Estado de visibilidad del modal. */
	open: boolean;
	/** Plan que se está confirmando. */
	plan: Plan | null;
	/** Datos capturados en el formulario. */
	details: PlanDetails;
	/** Estado del envío. */
	status: SubmissionStatus;
	/** Mensaje de error a mostrar. */
	errorMessage: string | null;
	/** Campo que.originó el error. */
	errorField: 'date' | 'time' | null;
	/** Fecha mínima seleccionable. */
	minDate: string;
	/** Callback al modificar un campo. */
	onChange: (patch: Partial<PlanDetails>) => void;
	/** Callback al cerrar el modal. */
	onClose: () => void;
	/** Callback al confirmar. */
	onSubmit: () => void;
}

/** Modal de confirmación con fecha, hora y nota opcional. */
export function ConfirmModal({
	open,
	plan,
	details,
	status,
	errorMessage,
	errorField,
	minDate,
	onChange,
	onClose,
	onSubmit
}: ConfirmModalProps) {
	const containerRef = useFocusTrap<HTMLDivElement>(open);
	const isSubmitting = status === 'submitting';

	useEffect(() => {
		if (!open) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') onClose();
		}

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [open, onClose]);

	if (!open || !plan) return null;

	function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
		if (event.target === event.currentTarget) onClose();
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onSubmit();
	}

	return (
		<div className={styles.overlay} onClick={handleOverlayClick}>
			<div
				className={styles.modal}
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-modal-title"
				ref={containerRef}
			>
				<p className={styles.emoji} aria-hidden="true">
					{plan.emoji}
				</p>
				<h3 className={styles.title} id="confirm-modal-title">
					{copy.modalTitle}
				</h3>
				<p className={styles.plan}>{plan.title}</p>

				<form className={styles.form} onSubmit={handleSubmit} noValidate>
					<div className={styles.field}>
						<label className={styles.label} htmlFor="plan-date">
							{copy.modalDateLabel}
						</label>
						<input
							className={`${styles.input} ${errorField === 'date' ? styles.invalid : ''}`}
							id="plan-date"
							name="date"
							type="date"
							min={minDate}
							value={details.date}
							onChange={(event) => onChange({ date: event.target.value })}
							required
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label} htmlFor="plan-time">
							{copy.modalTimeLabel}
						</label>
						<input
							className={`${styles.input} ${errorField === 'time' ? styles.invalid : ''}`}
							id="plan-time"
							name="time"
							type="time"
							value={details.time}
							onChange={(event) => onChange({ time: event.target.value })}
							required
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label} htmlFor="plan-note">
							{copy.modalNoteLabel}
						</label>
						<textarea
							className={styles.input}
							id="plan-note"
							name="note"
							rows={3}
							maxLength={NOTE_MAX_LENGTH}
							placeholder={copy.modalNotePlaceholder}
							value={details.note}
							onChange={(event) => onChange({ note: event.target.value })}
						/>
						<span className={styles.counter} aria-live="polite">
							{details.note.length}/{NOTE_MAX_LENGTH}
						</span>
					</div>

					<div className={styles.actions}>
						<Button
							variant="ghost"
							label={copy.modalCancel}
							onClick={onClose}
							disabled={isSubmitting}
						/>
						<Button type="submit" label={copy.modalConfirm} loading={isSubmitting} />
					</div>

					{errorMessage ? (
						<p className={styles.error} role="alert">
							{errorMessage}
						</p>
					) : null}
				</form>
			</div>
		</div>
	);
}
