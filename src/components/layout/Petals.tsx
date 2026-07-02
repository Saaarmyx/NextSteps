import { useMemo } from 'react';
import styles from './Petals.module.css';

const EMOJIS = ['🌸', '🌷', '🌹', '💮', '🤍'] as const;
const PETAL_COUNT = 26;

interface Petal {
	id: number;
	emoji: string;
	left: number;
	drift: number;
	duration: number;
	delay: number;
	size: number;
}

function createPetals(): Petal[] {
	return Array.from({ length: PETAL_COUNT }, (_, index) => ({
		id: index,
		emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)] as string,
		left: Math.random() * 100,
		drift: (Math.random() - 0.5) * 160,
		duration: 6 + Math.random() * 5,
		delay: Math.random() * 3,
		size: 0.9 + Math.random() * 0.9
	}));
}

interface PetalsProps {
	/** Activa la lluvia de pétalos. */
	active: boolean;
}

/** Lluvia de pétalos animados que acompaña la carta final. */
export function Petals({ active }: PetalsProps) {
	// Se generan al activarse y se descartan al desactivarse.
	const petals = useMemo(() => (active ? createPetals() : []), [active]);

	return (
		<div className={`${styles.petals} ${active ? styles.show : ''}`} aria-hidden="true">
			{petals.map((petal) => (
				<span
					key={petal.id}
					className={styles.petal}
					style={{
						left: `${petal.left}vw`,
						fontSize: `${petal.size}rem`,
						animationDuration: `${petal.duration}s`,
						animationDelay: `${petal.delay}s`,
						['--drift' as string]: `${petal.drift}px`
					}}
				>
					{petal.emoji}
				</span>
			))}
		</div>
	);
}
