import MenuPage from '@/app/(public)/menu/page';
import { render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  props: undefined as
    | undefined
    | { searchParams: Promise<Record<string, string>> },
  shouldSuspend: false,
}));

vi.mock('@/app/(public)/menu/(components)/menu-view', () => ({
  MenuView: (props: { searchParams: Promise<Record<string, string>> }) => {
    mocks.props = props;

    if (mocks.shouldSuspend) {
      throw new Promise<void>(() => {});
    }

    return <div data-testid="menu-view" />;
  },
}));

describe('Test on <MenuPage /> component', () => {
  beforeEach(() => {
    mocks.props = undefined;
    mocks.shouldSuspend = false;
  });

  test('Should render its content', () => {
    render(<MenuPage searchParams={Promise.resolve({})} />);

    expect(screen.getByTestId('menu-view')).toBeVisible();
  });

  test('Should forward the search params to the menu view', () => {
    const searchParams = Promise.resolve({
      category: 'pizza-4x6g',
      page: '2',
    });

    render(<MenuPage searchParams={searchParams} />);

    expect(mocks.props?.searchParams).toBe(searchParams);
  });

  test('Should show the dishes skeleton while the menu view loads', () => {
    mocks.shouldSuspend = true;

    render(<MenuPage searchParams={Promise.resolve({})} />);

    expect(screen.getByTestId('menu-dishes-skeleton')).toBeVisible();
    expect(screen.queryByTestId('menu-view')).not.toBeInTheDocument();
  });
});
