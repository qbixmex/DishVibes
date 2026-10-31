import { DishItem } from '@/app/(public)/(home)/dishes-section/dishes-grid/dish-item';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { render, screen } from '@testing-library/react';

const createDish = (overrides: Partial<Dish> = {}): Dish => ({
  id: 'dish-id',
  name: 'Margherita',
  slug: 'margherita',
  imageUrl: '/images/margherita.webp',
  description: 'Tomato, mozzarella and basil.',
  price: 12,
  featured: true,
  categoryId: 'pizza-id',
  ...overrides,
});

describe('Test on <DishItem /> component', () => {
  test('Should render the dish name, description, price and CTA', () => {
    render(<DishItem dish={createDish()} />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Margherita' }),
    ).toBeInTheDocument();
    expect(screen.getByText('$12')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add order/i }),
    ).toBeInTheDocument();
  });

  test('Should render the dish image with a descriptive alt text', () => {
    render(<DishItem dish={createDish()} />);

    const image = screen.getByAltText('Margherita pizza');

    expect(image.getAttribute('src')).toContain('margherita.webp');
  });

  test('Should truncate names longer than 26 characters', () => {
    const longName = 'x'.repeat(27);

    render(<DishItem dish={createDish({ name: longName })} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      `${'x'.repeat(26)} ...`,
    );
  });

  test('Should not truncate names with 26 characters or less', () => {
    const name = 'x'.repeat(26);

    render(<DishItem dish={createDish({ name })} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(name);
  });

  test('Should truncate the description to 68 characters', () => {
    const description = 'd'.repeat(80);

    render(<DishItem dish={createDish({ description })} />);

    expect(
      screen.getByText(`${'d'.repeat(68)} ...`),
    ).toBeInTheDocument();
  });

  test('Should render a placeholder when the dish has no image', () => {
    const { container } = render(<DishItem dish={createDish({ imageUrl: '' })} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });
});
