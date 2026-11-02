import { Hamburger, LayoutGrid, Pizza, type LucideIcon } from 'lucide-react';
import { CategoryItem } from '@/app/(public)/(home)/dishes-section/categories-selector/category-item';
import type { Category } from '@/shared/interfaces/category.interface';
import { useDishCategoryStore } from '@/store/use-dish-category-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type CategoryFixture = Category & { icon: LucideIcon };

const featuredCategory: CategoryFixture = {
  id: '1eb02c49',
  name: 'Featured',
  icon: LayoutGrid,
};

const pizzaCategory: CategoryFixture = {
  id: '4fbe4d4d',
  name: 'Pizza',
  icon: Pizza,
};

const burgersCategory: CategoryFixture = {
  id: '9deba07b',
  name: 'Burgers',
  icon: Hamburger,
};

describe('Test on <CategoryItem /> component', () => {
  beforeEach(() => {
    useDishCategoryStore.setState({ categoryId: null });
  });

  const renderCategories = (...categories: CategoryFixture[]) => {
    render(
      <>
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </>,
    );

    return {
      user: userEvent.setup(),
      item: (category: CategoryFixture) => screen.getByText(category.name),
    };
  };

  test('Should mark Featured as selected when there is no category selected', () => {
    const { item } = renderCategories(featuredCategory);

    expect(item(featuredCategory)).toHaveClass('text-orange-500');
  });

  test('Should mark the category as selected when it matches the store', () => {
    useDishCategoryStore.setState({ categoryId: pizzaCategory.id });

    const { item } = renderCategories(pizzaCategory);

    expect(item(pizzaCategory)).toHaveClass('text-orange-500');
  });

  test('Should select a category on click', async () => {
    const { user, item } = renderCategories(featuredCategory, pizzaCategory);

    await user.click(item(pizzaCategory));

    expect(useDishCategoryStore.getState().categoryId).toBe(pizzaCategory.id);
    expect(item(pizzaCategory)).toHaveClass('text-orange-500');
    expect(item(featuredCategory)).not.toHaveClass('text-orange-500');
  });

  test('Should replace the selected category when clicking another one', async () => {
    useDishCategoryStore.setState({ categoryId: burgersCategory.id });

    const { user, item } = renderCategories(burgersCategory, pizzaCategory);

    const burgers = item(burgersCategory);

    expect(burgers).toHaveClass('text-orange-500');

    await user.click(item(pizzaCategory));

    expect(useDishCategoryStore.getState().categoryId).toBe(pizzaCategory.id);
    expect(item(pizzaCategory)).toHaveClass('text-orange-500');
    expect(burgers).not.toHaveClass('text-orange-500');
  });

  test('Should deselect the category when clicking it again', async () => {
    useDishCategoryStore.setState({ categoryId: pizzaCategory.id });

    const { user, item } = renderCategories(featuredCategory, pizzaCategory);

    const pizza = item(pizzaCategory);

    expect(pizza).toHaveClass('text-orange-500');

    await user.click(pizza);

    expect(useDishCategoryStore.getState().categoryId).toBe(null);
    expect(pizza).not.toHaveClass('text-orange-500');
    expect(item(featuredCategory)).toHaveClass('text-orange-500');
  });

  test('Should deselect the selected category when clicking Featured', async () => {
    useDishCategoryStore.setState({ categoryId: pizzaCategory.id });

    const { user, item } = renderCategories(featuredCategory, pizzaCategory);

    const pizza = item(pizzaCategory);

    expect(pizza).toHaveClass('text-orange-500');
    expect(item(featuredCategory)).not.toHaveClass('text-orange-500');

    await user.click(item(featuredCategory));

    expect(useDishCategoryStore.getState().categoryId).toBe(null);
    expect(pizza).not.toHaveClass('text-orange-500');
    expect(item(featuredCategory)).toHaveClass('text-orange-500');
  });
});
