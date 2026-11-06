import { CategoriesSelector } from '@/app/(public)/(home)/dishes-section/categories-selector';
import { categories } from '@/shared/data/categories';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mocks = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
  usePathname: () => '/',
}));

vi.mock('embla-carousel-react', () => ({
  default: () => [vi.fn(), vi.fn()],
}));

const pizza = categories.find((category) => category.name === 'Pizza');

if (!pizza) throw new Error('Category [Pizza] not found');

describe('Test on <CategoriesSelector /> component', () => {
  const renderSelector = (category?: string) =>
    render(<CategoriesSelector searchParams={{ category }} />);

  beforeEach(() => {
    mocks.push.mockClear();
  });

  test('Should render a carousel region', () => {
    renderSelector();

    const region = screen.getByRole('region', { name: 'Categories' });

    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
  });

  test('Should render one slide per category', () => {
    renderSelector();

    const slides = screen.getAllByRole('group');

    expect(slides).toHaveLength(categories.length);

    categories.forEach((category, index) => {
      expect(screen.getByText(category.name)).toBeVisible();
      expect(slides[index]).toHaveAttribute(
        'aria-label',
        `${index + 1} of ${categories.length}`,
      );
    });
  });

  test('Should mark Featured as selected when there is no category', () => {
    renderSelector();

    expect(screen.getByText('Featured')).toHaveClass('text-orange-500');
  });

  test('Should mark the category from the URL as selected', () => {
    renderSelector(pizza.id);

    expect(screen.getByText('Pizza')).toHaveClass('text-orange-500');
  });

  test('Should navigate to the selected category', async () => {
    const user = userEvent.setup();

    renderSelector();

    await user.click(screen.getByText('Pizza'));

    expect(mocks.push).toHaveBeenCalledWith(`/?category=${pizza.id}`, {
      scroll: false,
    });
  });

  test('Should clear the category when clicking the selected category again', async () => {
    const user = userEvent.setup();

    renderSelector(pizza.id);

    await user.click(screen.getByText('Pizza'));

    expect(mocks.push).toHaveBeenCalledWith('/', { scroll: false });
  });

  test('Should clear the category when clicking Featured', async () => {
    const user = userEvent.setup();

    renderSelector(pizza.id);

    await user.click(screen.getByText('Featured'));

    expect(mocks.push).toHaveBeenCalledWith('/', { scroll: false });
  });
});
