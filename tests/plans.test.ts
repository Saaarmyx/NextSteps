import { describe, expect, it } from 'vitest';
import { findPlanById, plans } from '../src/data/plans';

describe('catálogo de planes', () => {
	it('no está vacío', () => {
		expect(plans.length).toBeGreaterThan(0);
	});

	it('no tiene identificadores repetidos', () => {
		const ids = plans.map((plan) => plan.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('cada plan tiene emoji, título y descripción', () => {
		for (const plan of plans) {
			expect(plan.emoji.length).toBeGreaterThan(0);
			expect(plan.title.trim().length).toBeGreaterThan(0);
			expect(plan.description.trim().length).toBeGreaterThan(0);
		}
	});

	it('los títulos no repiten la marca "Futuro"', () => {
		for (const plan of plans) {
			expect(plan.title).not.toMatch(/futuro/i);
		}
	});

	it('encuentra un plan por su identificador', () => {
		expect(findPlanById('cafe')?.title).toBe('Café + charla');
		expect(findPlanById('no-existe')).toBeUndefined();
	});
});
