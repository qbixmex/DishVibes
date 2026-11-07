import { OrdersView } from '@/app/(public)/orders/(components)/orders-view';
import { useOrderStore } from '@/shared/stores/order-store';
import { createOrderLine, resetOrderStore } from '@/tests/utils/order';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Tests on <OrdersView /> component', () => {
  beforeEach(() => {
    resetOrderStore();
  });

  test('Should render the singular title for a single line', () => {
    useOrderStore.setState({ lines: [createOrderLine()] });

    render(<OrdersView suggestions={[]} />);

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

    render(<OrdersView suggestions={[]} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Your Orders' }),
    ).toBeVisible();
  });

  test('Should render the empty state when there are no lines', () => {
    render(<OrdersView suggestions={[]} />);

    expect(screen.getByTestId('empty-order')).toBeVisible();
    expect(screen.getByText('Your order is empty')).toBeVisible();
  });

  test('Should render the order lines and the summary', () => {
    useOrderStore.setState({ lines: [createOrderLine()] });

    render(<OrdersView suggestions={[]} />);

    expect(screen.getByText('Pepperoni Pizza')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Order Summary' })).toBeVisible();
  });

  test('Should render a skeleton while the order is not hydrated', () => {
    useOrderStore.setState({ hydrated: false });

    const { container } = render(<OrdersView suggestions={[]} />);

    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);
  });

  test('Should add a suggested drink to the order', async () => {
    const user = userEvent.setup();
    const suggestion = {
      id: 'drink-1',
      name: 'Coca-Cola',
      slug: 'coca-cola-drink',
      imageUrl: '/images/drinks/coca-cola-drink.jpg',
      description: 'A chilled glass of classic Coca-Cola.',
      price: 2.5,
      featured: true,
      categoryId: 'drinks',
    };

    render(<OrdersView suggestions={[suggestion]} />);

    expect(
      screen.getByRole('heading', { name: 'You might also like' }),
    ).toBeVisible();

    await user.click(
      screen.getByRole('button', { name: 'Add Coca-Cola to your order' }),
    );

    expect(useOrderStore.getState().lines).toEqual([
      expect.objectContaining({
        dishId: 'drink-1',
        quantity: 1,
        dish: expect.objectContaining({ name: 'Coca-Cola', price: 2.5 }),
      }),
    ]);
  });
});
