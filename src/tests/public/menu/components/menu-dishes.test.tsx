import { MenuDishes } from '@/app/(public)/menu/(components)/menu-dishes';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  getDishesAction: vi.fn(),
}));

vi.mock('@/app/(public)/menu/(actions)/get-dishes.action', () => ({
  getDishesAction: mocks.getDishesAction,
}));

vi.mock('@/app/(public)/menu/(components)/dishes-grid', () => ({
  DishesGrid: ({ dishes }: { dishes: Dish[] }) => (
    <div data-testid="dishes-grid">{dishes.length}</div>
  ),
}));

vi.mock('@/shared/components/pagination', () => ({
  default: ({ totalPages }: { totalPages: number }) => (
    <nav data-testid="pagination">pages:{totalPages}</nav>
  ),
}));

const renderDishes = async (searchParams: Record<string, string> = {}) => {
  const view = await MenuDishes({ searchParams });

  render(view);
};

describe('Test on <MenuDishes /> component', () => {
  beforeEach(() => {
    mocks.getDishesAction.mockResolvedValue({
      success: true,
      error: null,
      dishes: [],
      pagination: { currentPage: 1, totalPages: 1 },
    });
  });

  test('Should render the dishes grid', async () => {
    mocks.getDishesAction.mockResolvedValue({
      success: true,
      error: null,
      dishes: [{ id: '1' }, { id: '2' }],
      pagination: { currentPage: 1, totalPages: 1 },
    });

    await renderDishes();

    expect(screen.getByTestId('dishes-grid')).toHaveTextContent('2');
  });

  test('Should hide the pagination when there is only one page', async () => {
    await renderDishes();

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  test('Should show the pagination when there is more than one page', async () => {
    mocks.getDishesAction.mockResolvedValue({
      success: true,
      error: null,
      dishes: [],
      pagination: { currentPage: 1, totalPages: 3 },
    });

    await renderDishes();

    expect(screen.getByTestId('pagination')).toHaveTextContent('pages:3');
  });

  test('Should forward the search params to the action', async () => {
    await renderDishes({ category: 'pizza', page: '2', limit: '4' });

    expect(mocks.getDishesAction).toHaveBeenCalledWith({
      category: 'pizza',
      page: 2,
      take: 4,
    });
  });

  test('Should default the page and the page size', async () => {
    await renderDishes({ category: 'pizza' });

    expect(mocks.getDishesAction).toHaveBeenCalledWith({
      category: 'pizza',
      page: 1,
      take: 8,
    });
  });

  test('Should render an empty grid without pagination when the action fails', async () => {
    mocks.getDishesAction.mockResolvedValue({
      success: false,
      error: 'There is no dishes with selected category',
      dishes: [],
      pagination: null,
    });

    await renderDishes();

    expect(screen.getByTestId('dishes-grid')).toHaveTextContent('0');
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  test('Should default the page but keep the requested page size', async () => {
    await renderDishes({ limit: '2' });

    expect(mocks.getDishesAction).toHaveBeenCalledWith({
      category: undefined,
      page: 1,
      take: 2,
    });
  });
});
