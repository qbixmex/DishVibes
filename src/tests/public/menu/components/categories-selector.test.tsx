import { MenuCategoriesSelector } from '@/app/(public)/menu/(components)/categories-selector';
import { categories, firstCategoryId } from '@/shared/data/categories';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mocks = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
  usePathname: () => '/menu',
}));

vi.mock('embla-carousel-react', () => ({
  default: () => [vi.fn(), vi.fn()],
}));

const categoryByName = (name: string) => {
  const category = categories.find((item) => item.name === name);

  if (!category) throw new Error(`Category [${name}] not found`);

  return category;
};

const pizza = categoryByName('Pizza');
const burgers = categoryByName('Burgers');

describe('Test on <MenuCategoriesSelector /> component', () => {
  beforeEach(() => {
    mocks.push.mockClear();
  });

  test('Should render all categories with no chip selected by default', () => {
    render(<MenuCategoriesSelector searchParams={{}} />);

    expect(screen.getAllByRole('group')).toHaveLength(categories.length);
    expect(screen.getByText('Featured')).not.toHaveClass('text-orange-500');
    expect(screen.getByText('Pizza')).not.toHaveClass('text-orange-500');
  });

  test('Should mark the category from the URL as selected', () => {
    render(<MenuCategoriesSelector searchParams={{ category: pizza.id }} />);

    expect(screen.getByText('Pizza')).toHaveClass('text-orange-500');
  });

  test('Should set the category and reset the page', async () => {
    const user = userEvent.setup();

    render(
      <MenuCategoriesSelector
        searchParams={{ category: pizza.id, page: '2', limit: '4' }}
      />,
    );

    await user.click(screen.getByText('Burgers'));

    expect(mocks.push).toHaveBeenCalledWith(
      `/menu?category=${burgers.id}&limit=4`,
      { scroll: false },
    );
  });

  test('Should clear the category when clicking the selected category', async () => {
    const user = userEvent.setup();

    render(
      <MenuCategoriesSelector
        searchParams={{ category: pizza.id, page: '2', limit: '4' }}
      />,
    );

    await user.click(screen.getByText('Pizza'));

    expect(mocks.push).toHaveBeenCalledWith('/menu?limit=4', { scroll: false });
  });

  test('Should select the featured category', async () => {
    const user = userEvent.setup();

    render(<MenuCategoriesSelector searchParams={{}} />);

    await user.click(screen.getByText('Featured'));

    expect(mocks.push).toHaveBeenCalledWith(
      `/menu?category=${firstCategoryId}`,
      { scroll: false },
    );
  });

  test('Should remove the query when clearing the category without a limit', async () => {
    const user = userEvent.setup();

    render(<MenuCategoriesSelector searchParams={{ category: pizza.id }} />);

    await user.click(screen.getByText('Pizza'));

    expect(mocks.push).toHaveBeenCalledWith('/menu', { scroll: false });
  });
});
