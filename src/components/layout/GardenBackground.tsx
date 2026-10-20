import styles from './GardenBackground.module.css';

/** Geometría de un tallo con dos hojas y una flor. */
const STEM_PATH = 'M0,0 C -4,-30 6,-55 -2,-90';
const LEAF_PATHS = [
	'M0,-25 C -18,-30 -22,-45 -8,-52 C -2,-42 0,-33 0,-25 Z',
	'M-2,-55 C 16,-58 22,-72 10,-80 C 2,-72 -2,-63 -2,-55 Z'
];
const PETAL_COUNT = 5;

/** Posición de cada tallo dentro del lienzo 1000x1000. */
const PLACEMENTS: ReadonlyArray<readonly [number, number, number, boolean]> = [
	[40, 1000, 1.1, false],
	[110, 1005, 0.8, true],
	[180, 998, 1.4, false],
	[860, 1000, 1.2, true],
	[930, 1005, 0.9, false],
	[960, 995, 1.5, true],
	[500, 1010, 0.7, false],
	[30, 990, 0.6, true],
	[970, 990, 0.65, false]
];

interface SprigProps {
	x: number;
	y: number;
	scale: number;
	flip: boolean;
	/** Alterna el color de la flor de forma determinista. */
	variant: number;
}

function Sprig({ x, y, scale, flip, variant }: SprigProps) {
	const petals = Array.from({ length: PETAL_COUNT }, (_, index) => {
		const angle = (index / PETAL_COUNT) * Math.PI * 2;
		const cx = -2 + Math.cos(angle) * 9;
		const cy = -90 + Math.sin(angle) * 9;
		return (
			<ellipse
				key={index}
				cx={cx}
				cy={cy}
				rx={6}
				ry={3.5}
				transform={`rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`}
				fill="none"
				stroke="rgba(216,167,160,0.55)"
				strokeWidth={1}
			/>
		);
	});

	return (
		<g
			className={styles.sprig}
			transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
		>
			<path d={STEM_PATH} />
			{LEAF_PATHS.map((d) => (
				<path key={d} d={d} fill="rgba(138,154,126,0.35)" stroke="none" />
			))}
			<circle
				cx={-2}
				cy={-90}
				r={5.5}
				className={variant % 2 === 0 ? styles.bloom : styles.bloomAlt}
			/>
			{petals}
		</g>
	);
}

/** Jardín decorativo de fondo, generado en SVG. */
export function GardenBackground() {
	return (
		<div className={styles.garden} aria-hidden="true">
			<svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMax slice">
				{PLACEMENTS.map(([x, y, scale, flip], index) => (
					<Sprig key={`${x}-${y}`} x={x} y={y} scale={scale} flip={flip} variant={index} />
				))}
			</svg>
		</div>
	);
}
