import { Pizza } from 'lucide-react';
import { CategoryItem } from '@/app/(public)/(home)/dishes-section/categories-selector/category-item';
import { useDishCategoryStore } from '@/store/use-dish-category-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const featuredCategory = { id: 'featured-id', name: 'Featured', icon: Pizza };
const pizzaCategory = { id: 'pizza-id', name: 'Pizza', icon: Pizza };

describe('Test on <CategoryItem /> component', () => {
  beforeEach(() => {
    useDishCategoryStore.setState({ categoryId: null });
  });

  test('Should mark Featured as selected when there is no category selected', () => {
    render(<CategoryItem category={featuredCategory} />);

    expect(screen.getByText('Featured')).toHaveClass('text-orange-500');
  });

  test('Should mark the category as selected when it matches the store', () => {
    useDishCategoryStore.setState({ categoryId: pizzaCategory.id });

    render(<CategoryItem category={pizzaCategory} />);

    expect(screen.getByText('Pizza')).toHaveClass('text-orange-500');
  });

  test('Should select a category on click', async () => {
    const user = userEvent.setup();
    render(<CategoryItem category={pizzaCategory} />);

    await user.click(screen.getByText('Pizza'));

    expect(useDishCategoryStore.getState().categoryId).toBe(pizzaCategory.id);
  });

  test('Should deselect a category when clicking it again', async () => {
    const user = userEvent.setup();
    useDishCategoryStore.setState({ categoryId: pizzaCategory.id });

    render(<CategoryItem category={pizzaCategory} />);

    await user.click(screen.getByText('Pizza'));

    expect(useDishCategoryStore.getState().categoryId).toBeNull();
  });

  test('Should replace the selected category when clicking another one', async () => {
    const user = userEvent.setup();
    useDishCategoryStore.setState({ categoryId: featuredCategory.id });

    render(<CategoryItem category={pizzaCategory} />);

    await user.click(screen.getByText('Pizza'));

    expect(useDishCategoryStore.getState().categoryId).toBe(pizzaCategory.id);
  });

  test('Should clear the selection when clicking Featured', async () => {
    const user = userEvent.setup();
    useDishCategoryStore.setState({ categoryId: pizzaCategory.id });

    render(<CategoryItem category={featuredCategory} />);

    await user.click(screen.getByText('Featured'));

    expect(useDishCategoryStore.getState().categoryId).toBeNull();
  });
});
