import { DishView } from '@/app/(public)/menu/[slug]/dish-view';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  getDishBySlug: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock('@/app/(public)/menu/[slug]/(actions)/get-dish-by-slug', () => ({
  getDishBySlug: mocks.getDishBySlug,
}));

vi.mock('next/navigation', () => ({
  notFound: () => mocks.notFound(),
}));

vi.mock('@/app/(public)/menu/[slug]/dish-details', () => ({
  DishDetails: ({ dish }: { dish: Dish }) => (
    <div data-testid="dish-details">{dish.name}</div>
  ),
}));

const dish: Dish = {
  id: 'd2f9d32f-fa53-4848-a8dc-675fce14641a',
  name: 'Pepperoni Pizza',
  slug: 'pepperoni-pizza',
  imageUrl: '/images/pizzas/pepperoni-pizza.png',
  description: 'Pepperoni slices, mozzarella cheese and tomato sauce.',
  price: 12.95,
  featured: true,
  categoryId: '4fbe4d4d',
};

const renderView = async (slug: string) => {
  const view = await DishView({ params: Promise.resolve({ slug }) });

  render(view);
};

describe('Tests on <DishView /> component', () => {
  beforeEach(() => {
    mocks.notFound.mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND');
    });
    mocks.getDishBySlug.mockResolvedValue({
      success: true,
      dish,
      error: null,
    });
  });

  test('Should resolve the slug and request the dish with it', async () => {
    await renderView(dish.slug);

    expect(mocks.getDishBySlug).toHaveBeenCalledWith(dish.slug);
    expect(mocks.getDishBySlug).toHaveBeenCalledTimes(1);
  });

  test('Should render the dish details with the found dish', async () => {
    await renderView(dish.slug);

    expect(screen.getByTestId('dish-details')).toHaveTextContent(dish.name);
  });

  test('Should render not found when the dish does not exist', async () => {
    mocks.getDishBySlug.mockResolvedValue({
      success: false,
      dish: null,
      error: `Dish with slug [${dish.slug}] not found`,
    });

    await expect(
      DishView({ params: Promise.resolve({ slug: dish.slug }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('dish-details')).not.toBeInTheDocument();
  });
});
