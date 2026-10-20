import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'textarea:not([disabled])',
	'select:not([disabled])',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

/**
 * Mantiene el foco dentro del contenedor mientras `active` es `true`
 * y lo devuelve al elemento de origen al desactivarse.
 *
 * @param active Estado del trampa de foco.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
	const containerRef = useRef<T | null>(null);
	const previouslyFocused = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!active) return;

		const container = containerRef.current;
		previouslyFocused.current = document.activeElement as HTMLElement | null;

		const focusable = container?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
		(focusable?.[0] ?? container)?.focus();

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key !== 'Tab' || !containerRef.current) return;

			const items = Array.from(
				containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
			);
			if (items.length === 0) {
				event.preventDefault();
				return;
			}

			const first = items[0] as HTMLElement;
			const last = items[items.length - 1] as HTMLElement;
			const activeElement = document.activeElement;

			if (event.shiftKey && activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			previouslyFocused.current?.focus?.();
		};
	}, [active]);

	return containerRef;
}
