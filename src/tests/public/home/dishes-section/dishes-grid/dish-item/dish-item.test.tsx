import { DishItem } from '@/app/(public)/(home)/dishes-section/dishes-grid/dish-item';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { isInaccessible, render, screen } from '@testing-library/react';

const createDish = (overrides: Partial<Dish> = {}): Dish => ({
  id: '029a42b3-9914-492a-bd70-f0d2c4742b19',
  name: 'Pepperoni Pizza',
  slug: 'pepperoni-pizza',
  imageUrl: '/images/pepperoni-pizza.webp',
  description: 'Pepperoni slices, tomato sauce, mozzarella cheese.',
  price: 12,
  featured: true,
  categoryId: '733a482d-b530-45e7-934f-058f39f92086',
  ...overrides,
});

describe('Test on <DishItem /> component', () => {
  test('Should render the dish name, description, price and CTA', () => {
    render(<DishItem dish={createDish()} />);

    const heading = screen.getByRole('heading', { level: 3, name: 'Pepperoni Pizza' });
    const price = screen.getByRole('status');
    const button = screen.getByRole('button', { name: /add order/i });

    expect(heading).toBeVisible();
    expect(price).toBeVisible();
    expect(price).toHaveTextContent('$12');
    expect(button).toBeVisible();
  });

  test('Should render the dish image with a descriptive alt text', () => {
    render(<DishItem dish={createDish()} />);

    const image = screen.getByAltText(/pepperoni pizza/i);

    expect(image.getAttribute('src')).toContain('pepperoni-pizza.webp');
  });

  test('Should truncate names longer than 26 characters', () => {
    const longName = 'x'.repeat(27);

    render(<DishItem dish={createDish({ name: longName })} />);

    const heading = screen.getByRole('heading', { level: 3 });

    expect(heading).toHaveTextContent(`${'x'.repeat(26)} ...`);
  });

  test('Should not truncate names with 26 characters or less', () => {
    const name = 'x'.repeat(26);

    render(<DishItem dish={createDish({ name })} />);

    const heading = screen.getByRole('heading', { level: 3 });

    expect(heading).toHaveTextContent(name);
  });

  test('Should truncate the description to 68 characters', () => {
    render(<DishItem dish={createDish({ description: 'd'.repeat(80) })} />);

    const description = screen.getByText(`${'d'.repeat(68)} ...`);

    expect(description).toBeVisible();
  });

  test('Should render a placeholder when the dish has no image', () => {
    render(<DishItem dish={createDish({ imageUrl: '' })} />);

    const image = screen.queryByRole('img');
    const figure = screen.getByTestId('image-placeholder');
    const icons = figure.getElementsByTagName('svg');

    expect(image).not.toBeInTheDocument();
    expect(figure).toBeVisible();
    expect(icons).toHaveLength(2);

    // Check if icons are hidden for accessibility
    for (const icon of icons) {
      expect(isInaccessible(icon)).toBe(true);
    }
  });
});
