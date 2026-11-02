import { DishesGrid } from '@/app/(public)/(home)/dishes-section/dishes-grid';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { act, render, screen } from '@testing-library/react';
import { Suspense } from 'react';

const mocks = vi.hoisted(() => ({ getHomeDishes: vi.fn() }));

vi.mock('@/app/(public)/(home)/actions/get-home-dishes', () => ({
  getHomeDishes: mocks.getHomeDishes,
}));

const pizzasCategoryId = '1a36f2cc-7610-4d82-a07d-8b66c46ebb8b';

const pepperoniPizza: Dish = {
  id: '2a0f2e1e-344d-4ca9-8d46-bdff5cf71af3',
  name: 'Pepperoni Pizza',
  slug: 'pepperoni-pizza',
  imageUrl: '/images/pepperoni-pizza.webp',
  description: 'Pepperoni slices, mozzarella cheese and tomato sauce.',
  price: 12,
  featured: true,
  categoryId: pizzasCategoryId,
};

const hawaiianPizza: Dish = {
  id: '8aa3b12f-560e-4157-af53-4de19fa471a0',
  name: 'Hawaiian Pizza',
  slug: 'hawaiian-pizza',
  imageUrl: '/images/hawaiian-pizza.webp',
  description: 'Pineapple slices, ham, mozzarella cheese and tomato sauce.',
  price: 12,
  featured: true,
  categoryId: pizzasCategoryId,
};

describe('Test on <DishesGrid /> component', () => {
  /**
   * The action caches each request, so `use` always receives the same promise
   * on every re-render. The mock has to do the same, otherwise React warns
   * about a component suspended by an uncached promise.
   */
  const mockHomeDishes = (dishes: Dish[]) => {
    const request = Promise.resolve(dishes);

    mocks.getHomeDishes.mockReturnValue(request);
  };

  const renderComponent = async (categoryId: string | null) => {
    await act(async () => {
      render(
        <Suspense fallback={<p>loading dishes</p>}>
          <DishesGrid categoryId={categoryId} />
        </Suspense>,
      );
    });

    return {
      mainHeading: screen.getByRole('heading', { name: /main dishes/i }),
    };
  };

  test('Should request the dishes with the given category and limit', async () => {
    mockHomeDishes([pepperoniPizza, hawaiianPizza]);

    await renderComponent(pizzasCategoryId);

    expect(mocks.getHomeDishes).toHaveBeenCalledWith({
      categoryId: pizzasCategoryId,
      limit: 4,
    });
  });

  test('Should render the heading and one item per dish', async () => {
    mockHomeDishes([pepperoniPizza, hawaiianPizza]);

    const { mainHeading } = await renderComponent(null);

    const dishesHeadings = screen.getAllByRole('heading', { level: 3 });

    expect(mainHeading).toBeVisible();
    expect(dishesHeadings).toHaveLength(2);

    const pepperoniPizzaHeading = screen.getByText('Pepperoni Pizza');
    const hawaiianPizzaDishHeading = screen.getByText('Hawaiian Pizza');

    expect(pepperoniPizzaHeading).toBeVisible();
    expect(hawaiianPizzaDishHeading).toBeVisible();
  });

  test('Should render an empty grid when there are no dishes', async () => {
    mockHomeDishes([]);
    const { mainHeading } = await renderComponent(null);
    const dishesHeadings = screen.queryAllByRole('heading', { level: 3 });

    expect(mainHeading).toBeVisible();
    expect(dishesHeadings).toHaveLength(0);
  });
});
