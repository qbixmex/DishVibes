import { act, Suspense } from 'react';
import { DishesGrid } from '@/app/(public)/(home)/dishes-section/dishes-grid';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ getHomeDishes: vi.fn() }));

vi.mock('@/app/(public)/(home)/actions/get-home-dishes', () => ({
  getHomeDishes: mocks.getHomeDishes,
}));

const createDish = (overrides: Partial<Dish> = {}): Dish => ({
  id: 'dish-id',
  name: 'Margherita',
  slug: 'margherita',
  imageUrl: '/images/margherita.webp',
  description: 'Tomato, mozzarella and basil.',
  price: 12,
  featured: true,
  categoryId: 'pizza-id',
  ...overrides,
});

describe('Test on <DishesGrid /> component', () => {
  const renderComponent = async (categoryId: string | null) => {
    await act(async () => {
      render(
        <Suspense fallback={<p>loading dishes</p>}>
          <DishesGrid categoryId={categoryId} />
        </Suspense>,
      );
    });
  };

  test('Should request the dishes with the given category and limit', async () => {
    mocks.getHomeDishes.mockResolvedValue([createDish()]);

    await renderComponent('pizza-id');

    expect(mocks.getHomeDishes).toHaveBeenCalledWith({
      categoryId: 'pizza-id',
      limit: 4,
    });
  });

  test('Should render the heading and one item per dish', async () => {
    mocks.getHomeDishes.mockResolvedValue([
      createDish({ id: 'dish-1', name: 'Margherita' }),
      createDish({ id: 'dish-2', name: 'Pepperoni' }),
    ]);

    await renderComponent(null);

    expect(
      screen.getByRole('heading', { name: /main dishes/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
  });

  test('Should render an empty grid when there are no dishes', async () => {
    mocks.getHomeDishes.mockResolvedValue([]);

    await renderComponent(null);

    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
  });
});
