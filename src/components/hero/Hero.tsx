import styles from './Hero.module.css';
import { copy, greeting } from '../../config/site';

/** Marca de la aplicación. Usa el logo alojado en `public/logo.png`. */
export function Brand() {
	return <img className={styles.logo} src="/logo.png" alt="" width={64} height={64} />;
}

/** Cabecera con la saludo, el título y la introducción. */
export function Hero() {
	return (
		<header className={styles.hero}>
			<Brand />
			<p className={styles.eyebrow}>{copy.eyebrow}</p>
			<h1 className={styles.title}>
				{greeting()}
				<em>¿qué te gustaría hacer?</em>
			</h1>
			<p className={styles.lead}>{copy.heroLead}</p>
		</header>
	);
}
