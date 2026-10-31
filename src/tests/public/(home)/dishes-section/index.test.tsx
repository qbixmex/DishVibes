import { DishesSection } from '@/app/(public)/(home)/dishes-section';
import { useDishCategoryStore } from '@/store/use-dish-category-store';
import { render, screen } from '@testing-library/react';

vi.mock('next/dynamic', () => ({
  default: () => (props: { categoryId: string | null }) => (
    <div data-testid="dishes-grid">category:{String(props.categoryId)}</div>
  ),
}));

vi.mock('@/app/(public)/(home)/dishes-section/categories-selector', () => ({
  CategoriesSelector: () => <div data-testid="categories-selector" />,
}));

describe('Test on <DishesSection /> component', () => {
  beforeEach(() => {
    useDishCategoryStore.setState({ categoryId: null });
  });

  test('Should render the categories selector and the dishes grid', () => {
    render(<DishesSection />);

    expect(screen.getByTestId('categories-selector')).toBeInTheDocument();
    expect(screen.getByTestId('dishes-grid')).toBeInTheDocument();
  });

  test('Should pass the selected category to the dishes grid', () => {
    useDishCategoryStore.setState({ categoryId: 'pizza-id' });

    render(<DishesSection />);

    expect(screen.getByTestId('dishes-grid')).toHaveTextContent(
      'category:pizza-id',
    );
  });

  test('Should pass null when there is no selected category', () => {
    render(<DishesSection />);

    expect(screen.getByTestId('dishes-grid')).toHaveTextContent(
      'category:null',
    );
  });
});
