import type { ReactNode } from 'react';
import { OrdersView } from '@/app/(public)/orders/(components)/orders-view';
import { useOrderStore } from '@/shared/stores/order-store';
import { createOrderLine, resetOrderStore } from '@/tests/utils/order';
import { render, screen } from '@testing-library/react';

const renderView = (suggestionsSlot: ReactNode = null) =>
  render(<OrdersView suggestionsSlot={suggestionsSlot} />);

describe('Tests on <OrdersView /> component', () => {
  beforeEach(() => {
    resetOrderStore();
  });

  test('Should render the singular title for a single line', () => {
    useOrderStore.setState({ lines: [createOrderLine()] });

    renderView();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Your Order' }),
    ).toBeVisible();
  });

  test('Should render the plural title for multiple lines', () => {
    useOrderStore.setState({
      lines: [
        createOrderLine(),
        createOrderLine({ lineId: 'line-2', dishId: 'dish-2' }),
      ],
    });

    renderView();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Your Orders' }),
    ).toBeVisible();
  });

  test('Should render the empty state when there are no lines', () => {
    renderView();

    expect(screen.getByTestId('empty-order')).toBeVisible();
    expect(screen.getByText('Your order is empty')).toBeVisible();
  });

  test('Should render the order lines and the summary', () => {
    useOrderStore.setState({ lines: [createOrderLine()] });

    renderView();

    expect(screen.getByText('Pepperoni Pizza')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Order Summary' })).toBeVisible();
  });

  test('Should render a skeleton while the order is not hydrated', () => {
    useOrderStore.setState({ hydrated: false });

    const { container } = renderView();

    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);
  });

  test('Should render the suggestions slot', () => {
    renderView(<aside data-testid="suggestions-slot" />);

    expect(screen.getByTestId('suggestions-slot')).toBeVisible();
  });

  test('Should render nothing in place of the suggestions slot by default', () => {
    renderView();

    expect(screen.queryByTestId('suggestions-slot')).not.toBeInTheDocument();
  });
});
