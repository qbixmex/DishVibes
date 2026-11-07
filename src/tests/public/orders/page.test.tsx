import OrdersPage from '@/app/(public)/orders/page';
import { useOrderStore } from '@/shared/stores/order-store';
import { resetOrderStore } from '@/tests/utils/order';
import { render, screen } from '@testing-library/react';

describe('Test on <OrdersPage /> component', () => {
  beforeEach(() => {
    resetOrderStore();
    useOrderStore.setState({ hydrated: false });
  });

  test('Should render its header', () => {
    render(<OrdersPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Your Orders' }),
    ).toBeVisible();
  });

  test('Should render the order items skeleton before the order is hydrated', () => {
    const { container } = render(<OrdersPage />);

    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);
  });

  test('Should render the drink suggestions', () => {
    render(<OrdersPage />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'You might also like' }),
    ).toBeVisible();
    expect(screen.getByText('Coca-Cola')).toBeVisible();
  });
});
