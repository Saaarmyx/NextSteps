import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppPhase, Plan, PlanDetails, SubmissionStatus } from '../types';
import { ApiError, requestSession, sendConfirmation } from '../lib/api';
import { sanitizeNote, validatePlanDetails } from '../lib/validation';
import { getTodayISODate } from '../lib/date';

const EMPTY_DETAILS: PlanDetails = { date: '', time: '', note: '' };

/** Estado y acciones del flujo de selección de un plan. */
export function usePlanSelection() {
	const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
	const [details, setDetails] = useState<PlanDetails>(EMPTY_DETAILS);
	const [phase, setPhase] = useState<AppPhase>('choosing');
	const [status, setStatus] = useState<SubmissionStatus>('idle');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [errorField, setErrorField] = useState<'date' | 'time' | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const today = useMemo(() => getTodayISODate(), []);

	// La sesión firmada se pide al montar: el envío exige esa cookie.
	useEffect(() => {
		const controller = new AbortController();
		requestSession(controller.signal).catch(() => {
			// Si falla, se reintenta en el momento del envío.
		});
		return () => controller.abort();
	}, []);

	const selectPlan = useCallback((plan: Plan) => {
		setSelectedPlan((current) => {
			// Al cambiar de plan se limpian los datos capturados en el modal.
			if (current && current.id !== plan.id) {
				setDetails(EMPTY_DETAILS);
				setErrorMessage(null);
				setErrorField(null);
			}
			return plan;
		});
	}, []);

	const openModal = useCallback(() => {
		if (!selectedPlan) return;
		setErrorMessage(null);
		setErrorField(null);
		setIsModalOpen(true);
	}, [selectedPlan]);

	const closeModal = useCallback(() => {
		if (status === 'submitting') return;
		setIsModalOpen(false);
	}, [status]);

	const updateDetails = useCallback((patch: Partial<PlanDetails>) => {
		setDetails((current) => ({ ...current, ...patch }));
		setErrorMessage(null);
		setErrorField(null);
	}, []);

	const submit = useCallback(async () => {
		if (!selectedPlan || status === 'submitting') return;

		const validation = validatePlanDetails(details, today);
		if (!validation.valid) {
			setErrorField(validation.field ?? null);
			setErrorMessage(validation.message ?? 'Revisa los datos del plan.');
			return;
		}

		setStatus('submitting');
		setErrorMessage(null);
		setErrorField(null);

		try {
			await requestSession();
			await sendConfirmation({
				emoji: selectedPlan.emoji,
				title: selectedPlan.title,
				description: selectedPlan.description,
				date: details.date,
				time: details.time,
				note: sanitizeNote(details.note)
			});

			setIsModalOpen(false);
			setStatus('idle');
			setPhase('letter');
		} catch (error) {
			setStatus('error');
			setErrorField(null);
			setErrorMessage(
				error instanceof ApiError && error.message
					? error.message
					: 'Algo salió mal enviando tu elección. Inténtalo de nuevo en un momento.'
			);
		}
	}, [details, selectedPlan, status, today]);

	const restart = useCallback(() => {
		setPhase('choosing');
		setSelectedPlan(null);
		setDetails(EMPTY_DETAILS);
		setStatus('idle');
		setErrorMessage(null);
		setErrorField(null);
		setIsModalOpen(false);
	}, []);

	return {
		selectedPlan,
		details,
		phase,
		status,
		errorMessage,
		errorField,
		isModalOpen,
		today,
		selectPlan,
		openModal,
		closeModal,
		updateDetails,
		submit,
		restart
	};
}
