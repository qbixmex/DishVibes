import { OrderSuggestions } from '@/app/(public)/orders/(components)/order-suggestions';
import type { OrderDishSnapshot } from '@/shared/interfaces/order.interface';
import { useOrderStore } from '@/shared/stores/order-store';
import { resetOrderStore } from '@/tests/utils/order';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const cocaCola: OrderDishSnapshot = {
  id: 'drink-1',
  name: 'Coca-Cola',
  slug: 'coca-cola-drink',
  imageUrl: '/images/drinks/coca-cola-drink.jpg',
  description: 'A chilled glass of classic Coca-Cola.',
  price: 2.5,
};

const fanta: OrderDishSnapshot = {
  id: 'drink-2',
  name: 'Fanta',
  slug: 'fanta-drink',
  imageUrl: '/images/drinks/fanta-drink.jpg',
  description: 'Bright orange Fanta served ice cold.',
  price: 2.5,
};

describe('Tests on <OrderSuggestions /> component', () => {
  beforeEach(() => {
    resetOrderStore();
  });

  test('Should render the suggestions heading and every card', () => {
    render(<OrderSuggestions suggestions={[cocaCola, fanta]} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'You might also like' }),
    ).toBeVisible();
    expect(screen.getByText('Coca-Cola')).toBeVisible();
    expect(screen.getByText('Fanta')).toBeVisible();
  });

  test('Should render the price of each suggestion', () => {
    render(<OrderSuggestions suggestions={[cocaCola]} />);

    expect(screen.getByText('$2.50')).toBeVisible();
  });

  test('Should render a placeholder when a suggestion has no image', () => {
    render(<OrderSuggestions suggestions={[{ ...fanta, imageUrl: '' }]} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('Should add a suggested drink to the order', async () => {
    const user = userEvent.setup();

    render(<OrderSuggestions suggestions={[cocaCola]} />);

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
