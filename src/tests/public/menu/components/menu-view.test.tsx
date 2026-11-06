import { MenuView } from '@/app/(public)/menu/(components)/menu-view';
import { render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  shouldSuspend: false,
}));

vi.mock('next/server', () => ({
  connection: vi.fn(),
}));

vi.mock('@/app/(public)/menu/(components)/categories-selector', () => ({
  MenuCategoriesSelector: () => <div data-testid="categories-selector" />,
}));

vi.mock('@/app/(public)/menu/(components)/menu-dishes', () => ({
  MenuDishes: () => {
    if (mocks.shouldSuspend) {
      throw new Promise<void>(() => {});
    }

    return <div data-testid="menu-dishes" />;
  },
}));

const renderView = async (searchParams: Record<string, string> = {}) => {
  const view = await MenuView({ searchParams: Promise.resolve(searchParams) });

  render(view);
};

describe('Test on <MenuView /> component', () => {
  beforeEach(() => {
    mocks.shouldSuspend = false;
  });

  test('Should render the categories selector and the menu dishes', async () => {
    await renderView();

    expect(screen.getByTestId('categories-selector')).toBeVisible();
    expect(screen.getByTestId('menu-dishes')).toBeVisible();
  });

  test('Should show the skeleton while the dishes are loading', async () => {
    mocks.shouldSuspend = true;

    await renderView();

    const skeleton = screen.getByTestId('menu-dishes-skeleton');

    expect(skeleton).toBeVisible();
    expect(skeleton.children).toHaveLength(8);
    expect(screen.queryByTestId('menu-dishes')).not.toBeInTheDocument();
  });

  test('Should keep the categories selector visible while the dishes load', async () => {
    mocks.shouldSuspend = true;

    await renderView();

    expect(screen.getByTestId('categories-selector')).toBeVisible();
  });
});
