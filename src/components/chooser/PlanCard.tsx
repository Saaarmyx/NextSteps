import type { Plan } from '../../types';
import { copy } from '../../config/site';
import styles from './PlanCard.module.css';

interface PlanCardProps {
	plan: Plan;
	selected: boolean;
	onSelect: (plan: Plan) => void;
}

/** Tarjeta de un plan. Accesible con teclado y con lector de pantalla. */
export function PlanCard({ plan, selected, onSelect }: PlanCardProps) {
	const titleId = `plan-${plan.id}-title`;

	function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		onSelect(plan);
	}

	return (
		<li className={styles.item}>
			<div
				className={`${styles.card} ${selected ? styles.selected : ''}`}
				role="button"
				tabIndex={0}
				aria-pressed={selected}
				aria-labelledby={titleId}
				onClick={() => onSelect(plan)}
				onKeyDown={handleKeyDown}
			>
				<span className={styles.icon} aria-hidden="true">
					{plan.emoji}
				</span>
				<h3 className={styles.title} id={titleId}>
					{plan.title}
				</h3>
				<p className={styles.description}>{plan.description}</p>
				{plan.future ? <span className={styles.badge}>{copy.futureBadge}</span> : null}
				<span className={styles.seal} aria-hidden="true">
					{plan.emoji}
				</span>
			</div>
		</li>
	);
}
