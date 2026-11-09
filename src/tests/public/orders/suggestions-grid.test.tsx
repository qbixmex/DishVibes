import { SuggestionsGrid } from '@/app/(public)/orders/(components)/suggestions-grid';
import type { OrderDishSnapshot } from '@/shared/interfaces/order.interface';
import { render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  getOrderSuggestions: vi.fn(),
}));

vi.mock('@/app/(public)/orders/(actions)/get-orders-suggestions', () => ({
  getOrderSuggestions: mocks.getOrderSuggestions,
}));

vi.mock('@/app/(public)/orders/(components)/order-suggestions', () => ({
  OrderSuggestions: ({ suggestions }: { suggestions: OrderDishSnapshot[] }) => (
    <div data-testid="order-suggestions">{suggestions.length}</div>
  ),
}));

const suggestions: OrderDishSnapshot[] = [
  {
    id: 'drink-1',
    name: 'Coca-Cola',
    slug: 'coca-cola-drink',
    imageUrl: '/images/drinks/coca-cola-drink.jpg',
    description: 'A chilled glass of classic Coca-Cola.',
    price: 2.5,
  },
  {
    id: 'drink-2',
    name: 'Fanta',
    slug: 'fanta-drink',
    imageUrl: '/images/drinks/fanta-drink.jpg',
    description: 'Bright orange Fanta served ice cold.',
    price: 2.5,
  },
];

const renderGrid = async () => {
  const view = await SuggestionsGrid({});

  return render(view);
};

describe('Tests on <SuggestionsGrid /> component', () => {
  beforeEach(() => {
    mocks.getOrderSuggestions.mockResolvedValue({
      success: true,
      errors: null,
      suggestions,
    });
  });

  test('Should render every suggestion returned by the action', async () => {
    await renderGrid();

    expect(screen.getByTestId('order-suggestions')).toHaveTextContent('2');
  });

  test('Should request the suggestions once', async () => {
    await renderGrid();

    expect(mocks.getOrderSuggestions).toHaveBeenCalledTimes(1);
  });

  test('Should render nothing when the action fails', async () => {
    mocks.getOrderSuggestions.mockResolvedValue({
      success: false,
      errors: 'There were no drinks available',
      suggestions: [],
    });

    const { container } = await renderGrid();

    expect(container).toBeEmptyDOMElement();
  });

  test('Should render nothing when there are no suggestions', async () => {
    mocks.getOrderSuggestions.mockResolvedValue({
      success: true,
      errors: null,
      suggestions: [],
    });

    const { container } = await renderGrid();

    expect(container).toBeEmptyDOMElement();
  });
});
