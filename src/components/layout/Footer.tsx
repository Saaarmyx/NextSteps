import { copy } from '../../config/site';
import styles from './Footer.module.css';

/** Pie de página de la experiencia. */
export function Footer() {
	return <footer className={styles.footer}>{copy.footer}</footer>;
}
