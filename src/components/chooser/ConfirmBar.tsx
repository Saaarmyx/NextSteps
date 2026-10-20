import type { Plan } from '../../types';
import { copy } from '../../config/site';
import { Button } from '../ui/Button';
import styles from './ConfirmBar.module.css';

interface ConfirmBarProps {
	/** Plan seleccionado. */
	plan: Plan | null;
	/** Callback al pulsar el botón de confirmación. */
	onConfirm: () => void;
}

/** Barra de resumen con el plan elegido y el botón de confirmación. */
export function ConfirmBar({ plan, onConfirm }: ConfirmBarProps) {
	return (
		<div className={`${styles.confirm} ${plan ? styles.show : ''}`}>
			<span className={styles.stamp} aria-hidden="true">
				{plan?.emoji ?? '🌿'}
			</span>
			<h4 className={styles.title}>{plan?.title ?? copy.confirmTitle}</h4>
			<p className={styles.description}>
				{plan?.description ?? 'Revisa tu elección y confírmala cuando estés segura.'}
			</p>
			<Button label={copy.confirmCta} onClick={onConfirm} disabled={!plan} />
		</div>
	);
}
