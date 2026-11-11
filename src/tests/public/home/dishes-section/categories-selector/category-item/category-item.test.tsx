import { LayoutGrid, Pizza, type LucideIcon } from 'lucide-react';
import { CategoryItem } from '@/app/(public)/(components)/categories-selector/category-item';
import type { Category } from '@/shared/interfaces/category.interface';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type CategoryFixture = Category & { icon: LucideIcon };

const featuredCategory: CategoryFixture = {
  id: '1eb02c49',
  name: 'Featured',
  slug: 'featured',
  aliases: ['featured'],
  icon: LayoutGrid,
};

const pizzaCategory: CategoryFixture = {
  id: '4fbe4d4d',
  name: 'Pizza',
  slug: 'pizza',
  aliases: ['pizza'],
  icon: Pizza,
};

describe('Test on <CategoryItem /> component', () => {
  test('Should render the category name', () => {
    render(
      <CategoryItem
        category={featuredCategory}
        isSelected={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText(featuredCategory.name)).toBeVisible();
  });

  test('Should mark the item as selected when isSelected is true', () => {
    render(
      <CategoryItem
        category={pizzaCategory}
        isSelected
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText(pizzaCategory.name)).toHaveClass('text-orange-500');
  });

  test('Should not mark the item as selected when isSelected is false', () => {
    render(
      <CategoryItem
        category={pizzaCategory}
        isSelected={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText(pizzaCategory.name)).not.toHaveClass('text-orange-500');
  });

  test('Should call onSelect with the category id when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <CategoryItem
        category={pizzaCategory}
        isSelected={false}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByText(pizzaCategory.name));

    expect(onSelect).toHaveBeenCalledWith(pizzaCategory.id);
  });
});
