import { DishDetails } from '@/app/(public)/menu/[slug]/dish-details';
import { categories } from '@/shared/data/categories';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { isInaccessible, render, screen } from '@testing-library/react';

vi.mock('@/app/(public)/menu/[slug]/dish-order-form', () => ({
  DishOrderForm: ({ dish }: { dish: Dish }) => (
    <div data-testid="dish-order-form">{dish.price}</div>
  ),
}));

const pizzasCategoryId = categories.find(
  (category) => category.name === 'Pizza',
)?.id as string;

const createDish = (overrides: Partial<Dish> = {}): Dish => ({
  id: 'd2f9d32f-fa53-4848-a8dc-675fce14641a',
  name: 'Pepperoni Pizza',
  slug: 'pepperoni-pizza',
  imageUrl: '/images/pizzas/pepperoni-pizza.png',
  description: 'Pepperoni slices, mozzarella cheese and tomato sauce.',
  price: 12.95,
  featured: true,
  categoryId: pizzasCategoryId,
  ...overrides,
});

describe('Tests on <DishDetails /> component', () => {
  test('Should render the dish name, description and formatted price', () => {
    render(<DishDetails dish={createDish()} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pepperoni Pizza' }),
    ).toBeVisible();
    expect(
      screen.getByText('Pepperoni slices, mozzarella cheese and tomato sauce.'),
    ).toBeVisible();
    expect(screen.getByText('$12.95')).toBeVisible();
  });

  test('Should render the dish image with a descriptive alt text', () => {
    render(<DishDetails dish={createDish()} />);

    const image = screen.getByAltText('Pepperoni Pizza meal');

    expect(image).toBeVisible();
    expect(image.getAttribute('src')).toContain('pepperoni-pizza.png');
  });

  test('Should render a placeholder when the dish has no image', () => {
    render(<DishDetails dish={createDish({ imageUrl: '' })} />);

    const placeholder = screen.getByTestId('image-placeholder');
    const icons = placeholder.getElementsByTagName('svg');

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(placeholder).toBeVisible();
    expect(icons).toHaveLength(2);

    for (const icon of icons) {
      expect(isInaccessible(icon)).toBe(true);
    }
  });

  test('Should render the category of the dish', () => {
    render(<DishDetails dish={createDish()} />);

    expect(screen.getByText('Pizza')).toBeVisible();
  });

  test('Should not render a category when it is unknown', () => {
    render(<DishDetails dish={createDish({ categoryId: 'unknown-id' })} />);

    expect(screen.queryByText('Pizza')).not.toBeInTheDocument();
  });

  test('Should link back to the menu', () => {
    render(<DishDetails dish={createDish()} />);

    const backLink = screen.getByRole('link', { name: /back to menu/i });

    expect(backLink).toHaveAttribute('href', '/menu');
  });

  test('Should render the order form for the dish', () => {
    render(<DishDetails dish={createDish()} />);

    expect(screen.getByTestId('dish-order-form')).toHaveTextContent('12.95');
  });
});
