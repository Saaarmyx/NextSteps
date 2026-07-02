import { useEffect, useState } from 'react';
import { GardenBackground } from './components/layout/GardenBackground';
import { Petals } from './components/layout/Petals';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/hero/Hero';
import { PlanGrid } from './components/chooser/PlanGrid';
import { ConfirmBar } from './components/chooser/ConfirmBar';
import { ConfirmModal } from './components/modal/ConfirmModal';
import { Letter } from './components/letter/Letter';
import { usePlanSelection } from './hooks/usePlanSelection';
import { copy } from './config/site';
import styles from './App.module.css';

/** Duración de la transición de salida antes de mostrar la carta. */
const FADE_DURATION = 650;

/** Etapa visible del catálogo. */
type Stage = 'chooser' | 'letter';

export default function App() {
	const {
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
	} = usePlanSelection();

	const [stage, setStage] = useState<Stage>('chooser');

	useEffect(() => {
		// El catálogo se desvanece primero y la carta aparece al terminar la transición.
		const timer = setTimeout(
			() => setStage(phase === 'letter' ? 'letter' : 'chooser'),
			phase === 'letter' ? FADE_DURATION : 0
		);

		return () => clearTimeout(timer);
	}, [phase]);

	return (
		<>
			<GardenBackground />
			<Petals active={phase === 'letter'} />

			<main className={styles.wrap}>
				<Hero />

				<section
					className={styles.chooser}
					hidden={stage !== 'chooser'}
					data-fading={phase === 'letter' || undefined}
				>
					<h2 className={styles.sectionTitle}>{copy.sectionTitle}</h2>
					<p className={styles.sectionSub}>{copy.sectionSub}</p>

					<PlanGrid selectedPlan={selectedPlan} onSelect={selectPlan} />
					<ConfirmBar plan={selectedPlan} onConfirm={openModal} />
				</section>

				{stage === 'letter' ? <Letter onRestart={restart} /> : null}
			</main>

			<Footer />

			<ConfirmModal
				open={isModalOpen}
				plan={selectedPlan}
				details={details}
				status={status}
				errorMessage={errorMessage}
				errorField={errorField}
				minDate={today}
				onChange={updateDetails}
				onClose={closeModal}
				onSubmit={submit}
			/>
		</>
	);
}
