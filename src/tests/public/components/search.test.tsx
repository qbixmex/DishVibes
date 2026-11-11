import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchDish } from '@/app/(public)/(components)/search-dish';
import { dishes } from '@/shared/data/all-dishes';
import { categories } from '@/shared/data/categories';
import { SEARCH_RESULT_LIMIT, searchDishes } from '@/lib/dish-search';

const mocks = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}));

const categoryByName = (name: string) => {
  const category = categories.find((item) => item.name === name);

  if (!category) throw new Error(`Category [${name}] not found`);

  return category;
};

const renderComponent = () => {
  const user = userEvent.setup();

  render(<SearchDish />);

  return {
    user,
    desktopTrigger: screen.getByRole('button', { name: 'Search the menu' }),
    mobileTrigger: screen.getByRole('button', { name: 'Open search' }),
    openPanel: async () => {
      await user.click(screen.getByRole('button', { name: 'Search the menu' }));

      return screen.getByRole('combobox', { name: 'Search dishes' });
    },
  };
};

describe('Test on <SearchDish /> component', () => {
  beforeEach(() => {
    mocks.push.mockClear();
  });

  test('Should render the desktop and mobile search triggers', () => {
    const { desktopTrigger, mobileTrigger } = renderComponent();

    expect(desktopTrigger).toBeInTheDocument();
    expect(mobileTrigger).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('Should open the panel and focus the search field', async () => {
    const { openPanel } = renderComponent();
    const input = await openPanel();

    expect(screen.getByRole('dialog', { name: 'Search the menu' })).toBeVisible();
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });

  test('Should show the popular dishes while the term is empty', async () => {
    const { openPanel } = renderComponent();

    await openPanel();

    const featured = dishes.filter((dish) => dish.featured);
    const expectedResults = featured.slice(0, SEARCH_RESULT_LIMIT);
    const options = screen.getAllByRole('option');

    expect(screen.getByText('Popular right now')).toBeVisible();
    expect(options).toHaveLength(expectedResults.length);
    expect(options[0]).toHaveTextContent(expectedResults[0].name);
    expect(screen.getByText(`${expectedResults.length} shown`)).toBeVisible();
  });

  test('Should filter dishes by name and link to their slug', async () => {
    const { user, openPanel } = renderComponent();
    const input = await openPanel();

    await user.type(input, 'pizza');

    const results = searchDishes('pizza').dishes.slice(0, SEARCH_RESULT_LIMIT);
    const options = screen.getAllByRole('option');

    expect(options).toHaveLength(results.length);
    expect(options[0]).toHaveAttribute('href', `/menu/${results[0].slug}`);
    expect(options[0]).not.toHaveAttribute('href', `/menu/${results[0].id}`);
    expect(screen.getByText('Results for “pizza”')).toBeVisible();
  });

  test('Should resolve category aliases such as “hamburguer”', async () => {
    const { user, openPanel } = renderComponent();
    const input = await openPanel();

    await user.type(input, 'hamburguer');

    const burgers = categoryByName('Burgers');
    const options = screen.getAllByRole('option');

    expect(options.length).toBeGreaterThan(0);
    expect(
      searchDishes('hamburguer').dishes.every(
        (dish) => dish.categoryId === burgers.id,
      ),
    ).toBe(true);
    expect(screen.getByRole('link', { name: 'See all' })).toHaveAttribute(
      'href',
      `/menu?category=${burgers.slug}`,
    );
  });

  test('Should build a text search link when the term does not match a category', async () => {
    const { user, openPanel } = renderComponent();
    const input = await openPanel();

    await user.type(input, 'cheese');

    expect(screen.getByRole('link', { name: 'See all' })).toHaveAttribute(
      'href',
      '/menu?search=cheese',
    );
  });

  test('Should show an empty state and hide “See all” when nothing matches', async () => {
    const { user, openPanel } = renderComponent();
    const input = await openPanel();

    await user.type(input, 'zzzzzz');

    expect(screen.getByRole('status')).toHaveTextContent(
      'No dishes found for “zzzzzz”.',
    );
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'See all' }),
    ).not.toBeInTheDocument();
  });

  test('Should highlight the first result with ArrowDown and wrap with the arrows', async () => {
    const { user, openPanel } = renderComponent();
    const input = await openPanel();

    await user.type(input, 'pizza');

    const results = searchDishes('pizza').dishes.slice(0, SEARCH_RESULT_LIMIT);
    const options = screen.getAllByRole('option');

    expect(input).not.toHaveAttribute('aria-activedescendant');

    await user.keyboard('{ArrowDown}');

    expect(input).toHaveAttribute('aria-activedescendant', 'search-dish-option-0');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowDown}');

    expect(input).toHaveAttribute('aria-activedescendant', 'search-dish-option-1');

    await user.keyboard('{ArrowUp}{ArrowUp}');

    expect(input).toHaveAttribute(
      'aria-activedescendant',
      `search-dish-option-${results.length - 1}`,
    );
  });

  test('Should open the highlighted dish with Enter using its slug', async () => {
    const { user, openPanel } = renderComponent();
    const input = await openPanel();

    await user.type(input, 'pizza');
    await user.keyboard('{ArrowDown}{Enter}');

    const [firstResult] = searchDishes('pizza').dishes;

    expect(mocks.push).toHaveBeenCalledWith(`/menu/${firstResult.slug}`);
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  test('Should do nothing when pressing Enter without a highlighted dish', async () => {
    const { user, openPanel } = renderComponent();
    const input = await openPanel();

    await user.type(input, 'pizza');
    await user.keyboard('{Enter}');

    expect(mocks.push).not.toHaveBeenCalled();
  });

  test('Should close the panel with Escape', async () => {
    const { user, openPanel } = renderComponent();

    await openPanel();
    await user.keyboard('{Escape}');

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  test('Should close the panel with the Close button', async () => {
    const { user, openPanel } = renderComponent();

    await openPanel();
    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  test('Should close the panel when clicking a result', async () => {
    const { user, openPanel } = renderComponent();
    const input = await openPanel();

    await user.type(input, 'pizza');
    await user.click(screen.getAllByRole('option')[0]);

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });
});
