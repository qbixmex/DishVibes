import { isInaccessible, render, screen } from '@testing-library/react';
import { Orders } from '@/app/(public)/(components)/orders';

describe('Test on <Orders /> component', () => {
  test('Should render a decorative bell icon', () => {
    const { container } = render(<Orders />);

    const icon = container.querySelector('svg');

    expect(icon).toBeVisible();
    expect(isInaccessible(icon!)).toBe(true);
  });

  test('Should render orders quantity', () => {
    render(<Orders />);

    const orderQuantity = screen.getByRole('status');

    expect(orderQuantity).toBeVisible();
    expect(orderQuantity).toHaveTextContent('5 orders in cart');
  });
});
