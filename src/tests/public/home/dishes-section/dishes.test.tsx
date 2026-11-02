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

    expect(screen.getByTestId('categories-selector')).toBeVisible();
    expect(screen.getByTestId('dishes-grid')).toBeVisible();
  });

  test('Should pass the selected category to the dishes grid', () => {
    useDishCategoryStore.setState({ categoryId: 'pizza-4x6g' });
    render(<DishesSection />);

    const dishesGrid = screen.getByTestId('dishes-grid');

    expect(dishesGrid).toHaveTextContent('category:pizza-4x6g');
  });

  test('Should pass null when there is no selected category', () => {
    render(<DishesSection />);

    const dishesGrid = screen.getByTestId('dishes-grid');

    expect(dishesGrid).toHaveTextContent('category:null');
  });
});
