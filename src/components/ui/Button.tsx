import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	/** Variante visual del botón. */
	variant?: ButtonVariant;
	/** Texto del botón (oculto visualmente mientras carga). */
	label: string;
	/** Muestra el spinner y desactiva el botón. */
	loading?: boolean;
}

/** Botón reutilizable con variantes primary/ghost y estado de carga. */
export function Button({
	variant = 'primary',
	label,
	loading = false,
	className,
	disabled,
	...rest
}: ButtonProps) {
	const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ');

	return (
		<button
			type="button"
			className={classes}
			disabled={disabled || loading}
			aria-busy={loading || undefined}
			{...rest}
		>
			<span className={styles.label} data-hidden={loading || undefined}>
				{label}
			</span>
			{loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
		</button>
	);
}
