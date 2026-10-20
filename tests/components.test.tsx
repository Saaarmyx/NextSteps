import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PlanCard } from '../src/components/chooser/PlanCard';
import { ConfirmBar } from '../src/components/chooser/ConfirmBar';
import type { Plan } from '../src/types';

const plan: Plan = {
	id: 'cafe',
	emoji: '☕',
	title: 'Café + charla',
	description: 'Un café tranquilo y mucha conversación.'
};

describe('PlanCard', () => {
	it('marca la tarjeta como seleccionada', () => {
		render(<PlanCard plan={plan} selected onSelect={() => {}} />);

		expect(screen.getByRole('button', { name: /Café \+ charla/ })).toHaveAttribute(
			'aria-pressed',
			'true'
		);
	});

	it('notifica la selección al hacer clic', () => {
		const onSelect = vi.fn();
		render(<PlanCard plan={plan} selected={false} onSelect={onSelect} />);

		fireEvent.click(screen.getByRole('button'));

		expect(onSelect).toHaveBeenCalledWith(plan);
	});

	it('permite seleccionar con el teclado', () => {
		const onSelect = vi.fn();
		render(<PlanCard plan={plan} selected={false} onSelect={onSelect} />);

		fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });

		expect(onSelect).toHaveBeenCalledWith(plan);
	});
});

describe('ConfirmBar', () => {
	it('muestra la descripción del plan elegido', () => {
		render(<ConfirmBar plan={plan} onConfirm={() => {}} />);

		expect(screen.getByText(plan.description)).toBeInTheDocument();
	});

	it('deshabilita la confirmación mientras no hay plan', () => {
		render(<ConfirmBar plan={null} onConfirm={() => {}} />);

		expect(screen.getByRole('button', { name: /Confirmar/ })).toBeDisabled();
	});
});
