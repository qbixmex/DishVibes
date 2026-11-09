import OrdersPage from '@/app/(public)/orders/page';
import { useOrderStore } from '@/shared/stores/order-store';
import { resetOrderStore } from '@/tests/utils/order';
import { render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  shouldSuspend: false,
}));

vi.mock('@/app/(public)/orders/(components)/suggestions-grid', () => ({
  SuggestionsGrid: () => {
    if (mocks.shouldSuspend) {
      throw new Promise<void>(() => {});
    }

    return <div data-testid="suggestions-grid" />;
  },
}));

describe('Test on <OrdersPage /> component', () => {
  beforeEach(() => {
    resetOrderStore();
    useOrderStore.setState({ hydrated: false });
    mocks.shouldSuspend = false;
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

  test('Should render the suggestions grid', () => {
    render(<OrdersPage />);

    expect(screen.getByTestId('suggestions-grid')).toBeVisible();
  });

  test('Should render the suggestions skeleton while the suggestions load', () => {
    mocks.shouldSuspend = true;

    render(<OrdersPage />);

    expect(screen.getByTestId('suggestions-skeleton')).toBeVisible();
    expect(screen.queryByTestId('suggestions-grid')).not.toBeInTheDocument();
  });
});
