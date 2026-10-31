import { CategoriesSelector } from '@/app/(public)/(home)/dishes-section/categories-selector';
import { categories } from '@/shared/data/categories';
import { render, screen } from '@testing-library/react';

vi.mock('embla-carousel-react', () => ({
  default: () => [vi.fn(), vi.fn()],
}));

describe('Test on <CategoriesSelector /> component', () => {
  test('Should render a carousel region', () => {
    render(<CategoriesSelector />);

    const region = screen.getByRole('region', { name: 'Categories' });

    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
  });

  test('Should render one slide per category', () => {
    render(<CategoriesSelector />);

    const slides = screen.getAllByRole('group');

    expect(slides).toHaveLength(categories.length);

    categories.forEach((category, index) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
      expect(slides[index]).toHaveAttribute(
        'aria-label',
        `${index + 1} of ${categories.length}`,
      );
    });
  });
});
