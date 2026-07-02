import type { Plan } from '../types';

/**
 * Catálogo de planes disponibles.
 * `future: true` marca ideas que todavía no se pueden hacer y se muestran
 * con una etiqueta en la tarjeta.
 */
export const plans: Plan[] = [
	{
		id: 'portal',
		emoji: '🛍️',
		title: 'Portal del Prado',
		description:
			'Pasear por el centro comercial, mirar tiendas, tomarnos algo y terminar con un postre.'
	},
	{
		id: 'cafe',
		emoji: '☕',
		title: 'Café + charla',
		description: 'Un café tranquilo, conversar sin mirar el reloj y caminar un rato después.'
	},
	{
		id: 'parque',
		emoji: '🌳',
		title: 'Parque Washington',
		description: 'Caminar entre los árboles, sentarnos un rato y disfrutar la tarde juntos.'
	},
	{
		id: 'mirador',
		emoji: '🌇',
		title: 'Mirador',
		description: 'Ver cómo cae el sol sobre la ciudad mientras compartimos algo para comer.'
	},
	{
		id: 'cine',
		emoji: '🎬',
		title: 'Día de cine',
		description:
			'Escoger una película, compartir crispetas y salir a comentar cuál fue la mejor escena.'
	},
	{
		id: 'apto',
		emoji: '🏠',
		title: 'Noche en el apartamento',
		description: 'Cocinamos algo rico entre los dos, ponemos una película y disfrutamos sin salir.'
	},
	{
		id: 'helado',
		emoji: '🍦',
		title: 'Helado para dos',
		description: 'Escoger nuestros sabores favoritos y caminar mientras nos ponemos al día.'
	},
	{
		id: 'restaurante',
		emoji: '🍝',
		title: 'Una buena comida',
		description: 'Descubrir un restaurante nuevo o volver a uno que nos guste mucho.'
	},
	{
		id: 'bowling',
		emoji: '🎳',
		title: 'Una partida de bowling',
		description: 'Competir un rato, reírnos de los lanzamientos malos y celebrar los buenos.'
	},
	{
		id: 'malecon',
		emoji: '🌊',
		title: 'Paseo por el malecón',
		description: 'Caminar junto al río, disfrutar la brisa y tomar muchas fotos juntos.'
	},
	{
		id: 'arcade',
		emoji: '🕹️',
		title: 'Arcade',
		description: 'Retarnos en algunos juegos y descubrir quién tiene mejores reflejos.'
	},
	{
		id: 'fotos',
		emoji: '📸',
		title: 'Una tarde de fotos',
		description: 'Buscar rincones bonitos, tomar muchas fotos y quedarnos con buenos recuerdos.'
	},
	{
		id: 'amanecer',
		emoji: '🌅',
		title: 'Ver un amanecer',
		description: 'Madrugar juntos para ver salir el sol y empezar el día con calma.',
		future: true
	},
	{
		id: 'estrellas',
		emoji: '🌌',
		title: 'Mirar las estrellas',
		description: 'Buscar un lugar oscuro, tender una manta y contar estrellas juntos.',
		future: true
	},
	{
		id: 'picnic',
		emoji: '🧺',
		title: 'Picnic',
		description: 'Preparar algo rico, buscar un buen rincón y disfrutar al aire libre.'
	},
	{
		id: 'pizza',
		emoji: '🍕',
		title: 'Pizza juntos',
		description: 'Pedir una pizza enorme y ponernos al día sin ningún afán.'
	},
	{
		id: 'postres',
		emoji: '🍰',
		title: 'Ir por postres',
		description: 'Probar algo dulce y descubrir juntos un nuevo lugar favorito.'
	},
	{
		id: 'ceramica',
		emoji: '🎨',
		title: 'Pintar cerámica',
		description: 'Elegir una pieza, pintarla con calma y llevarnos un recuerdo hecho por nosotros.',
		future: true
	},
	{
		id: 'billar',
		emoji: '🎯',
		title: 'Billar',
		description: 'Jugar unas partidas, hacer apuestas tontas y reírnos de los tiros fallidos.',
		future: true
	},
	{
		id: 'escaperoom',
		emoji: '🧩',
		title: 'Escape Room',
		description: 'Resolver acertijos juntos contra el reloj y ver si logramos escapar a tiempo.',
		future: true
	},
	{
		id: 'roadtrip',
		emoji: '🚗',
		title: 'Road Trip',
		description: 'Subirnos al carro sin afán, poner música y dejar que el camino decida.',
		future: true
	},
	{
		id: 'paseobote',
		emoji: '🛶',
		title: 'Paseo en bote',
		description: 'Navegar tranquilos, sentir la brisa y disfrutar la vista desde el agua.',
		future: true
	},
	{
		id: 'feria',
		emoji: '🎡',
		title: 'Feria',
		description: 'Subirnos a las atracciones, comer algo rico y ganar un peluche si se puede.',
		future: true
	},
	{
		id: 'concierto',
		emoji: '🎻',
		title: 'Concierto',
		description: 'Disfrutar música en vivo y cantar juntos nuestras canciones favoritas.',
		future: true
	},
	{
		id: 'libreria',
		emoji: '📚',
		title: 'Librería',
		description: 'Perdernos entre libros, buscar algo nuevo y leer un rato juntos.'
	},
	{
		id: 'jardinbotanico',
		emoji: '🌺',
		title: 'Jardín Botánico',
		description: 'Caminar entre flores y plantas, tomar fotos y respirar aire fresco.'
	},
	{
		id: 'videojuegos',
		emoji: '🎮',
		title: 'Noche de videojuegos',
		description: 'Retarnos en la consola y ver quién gana más rondas.',
		future: true
	},
	{
		id: 'bubbletea',
		emoji: '🧋',
		title: 'Bubble Tea',
		description: 'Probar sabores nuevos y caminar con nuestro bubble tea en mano.'
	},
	{
		id: 'sushi',
		emoji: '🍣',
		title: 'Sushi',
		description: 'Compartir un buen sushi y descubrir combinaciones nuevas juntos.'
	},
	{
		id: 'playa',
		emoji: '🏖️',
		title: 'Día de playa',
		description: 'Sentir la arena, meternos al mar y desconectarnos del mundo un rato.'
	},
	{
		id: 'desayuno',
		emoji: '☀️',
		title: 'Desayuno juntos',
		description: 'Empezar el día con calma, buen café y mucha conversación.'
	},
	{
		id: 'propio',
		emoji: '🎁',
		title: '¿Tienes algo en mente?',
		description: 'Tú propones el plan de la siguiente salida.'
	},
	{
		id: 'sorpresa',
		emoji: '🎁',
		title: 'Sorpréndeme',
		description: 'Déjame planear algo especial y sorprenderte por completo.'
	}
];

/** Planos marcados como idea a futuro. */
export const futurePlans = plans.filter((plan) => plan.future);

/** Busca un plan por su identificador. */
export function findPlanById(id: string): Plan | undefined {
	return plans.find((plan) => plan.id === id);
}
