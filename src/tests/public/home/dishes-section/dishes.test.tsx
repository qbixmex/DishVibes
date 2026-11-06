import { act } from 'react';
import { DishesSection } from '@/app/(public)/(home)/dishes-section';
import { firstCategoryId } from '@/shared/data/categories';
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
  const renderSection = async (category?: string) => {
    await act(async () => {
      render(
        <DishesSection searchParams={Promise.resolve({ category })} />,
      );
    });
  };

  test('Should render the categories selector and the dishes grid', async () => {
    await renderSection();

    expect(screen.getByTestId('categories-selector')).toBeVisible();
    expect(screen.getByTestId('dishes-grid')).toBeVisible();
  });

  test('Should pass the selected category to the dishes grid', async () => {
    await renderSection('pizza-4x6g');

    const dishesGrid = screen.getByTestId('dishes-grid');

    expect(dishesGrid).toHaveTextContent('category:pizza-4x6g');
  });

  test('Should pass null when there is no selected category', async () => {
    await renderSection();

    const dishesGrid = screen.getByTestId('dishes-grid');

    expect(dishesGrid).toHaveTextContent('category:null');
  });

  test('Should treat the featured category id as no category', async () => {
    await renderSection(firstCategoryId);

    const dishesGrid = screen.getByTestId('dishes-grid');

    expect(dishesGrid).toHaveTextContent('category:null');
  });
});
