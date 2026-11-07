import { isInaccessible, render, screen } from '@testing-library/react';
import { Orders } from '@/app/(public)/(components)/orders';
import { createOrderLine, resetOrderStore } from '@/tests/utils/order';
import { useOrderStore } from '@/shared/stores/order-store';

describe('Test on <Orders /> component', () => {
  beforeEach(() => {
    resetOrderStore();
  });

  test('Should render a decorative bell icon', () => {
    const { container } = render(<Orders />);

    const icon = container.querySelector('svg');

    expect(icon).toBeVisible();
    expect(isInaccessible(icon!)).toBe(true);
  });

  test('Should link to the orders page', () => {
    render(<Orders />);

    const link = screen.getByRole('link', { name: /go to your orders/i });

    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', '/orders');
  });

  test('Should hide the quantity when the order is empty', () => {
    render(<Orders />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('Should render the total quantity of the order', () => {
    useOrderStore.setState({
      lines: [
        createOrderLine({ lineId: 'line-1', quantity: 2 }),
        createOrderLine({ lineId: 'line-2', dishId: 'dish-2', quantity: 3 }),
      ],
    });

    render(<Orders />);

    expect(screen.getByRole('status')).toHaveTextContent('5 orders in cart');
  });

  test('Should use the singular label for a single unit', () => {
    useOrderStore.setState({
      lines: [createOrderLine({ quantity: 1 })],
    });

    render(<Orders />);

    expect(screen.getByRole('status')).toHaveTextContent('1 order in cart');
  });
});
