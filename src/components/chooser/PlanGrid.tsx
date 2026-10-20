import type { Plan } from '../../types';
import { plans } from '../../data/plans';
import { PlanCard } from './PlanCard';
import styles from './PlanGrid.module.css';

interface PlanGridProps {
	/** Plan actualmente seleccionado. */
	selectedPlan: Plan | null;
	/** Callback al elegir un plan. */
	onSelect: (plan: Plan) => void;
}

/** Cuadrícula con todos los planes disponibles. */
export function PlanGrid({ selectedPlan, onSelect }: PlanGridProps) {
	return (
		<ul className={styles.cards}>
			{plans.map((plan) => (
				<PlanCard
					key={plan.id}
					plan={plan}
					selected={selectedPlan?.id === plan.id}
					onSelect={onSelect}
				/>
			))}
		</ul>
	);
}
