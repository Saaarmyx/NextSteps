import { useEffect, useRef } from 'react';
import { copy } from '../../config/site';
import { Button } from '../ui/Button';
import styles from './Letter.module.css';

interface LetterProps {
	/** Callback para volver al catálogo de planes. */
	onRestart: () => void;
}

/** Carta final que se revela tras confirmar la elección. */
export function Letter({ onRestart }: LetterProps) {
	const sectionRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}, []);

	return (
		<section className={styles.letter} ref={sectionRef} aria-live="polite">
			<span className={styles.stamp} aria-hidden="true">
				🖤
			</span>
			<p className={styles.title}>{copy.letter.title}</p>
			{copy.letter.lines.map((line) => (
				<p className={styles.line} key={line}>
					{line}
				</p>
			))}
			<Button variant="ghost" label={copy.letter.restart} onClick={onRestart} />
		</section>
	);
}
