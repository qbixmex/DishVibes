import { DishesGrid } from '@/app/(public)/menu/(components)/dishes-grid';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { render, screen } from '@testing-library/react';

const createDish = (overrides: Partial<Dish> = {}): Dish => ({
  id: '029a42b3-9914-492a-bd70-f0d2c4742b19',
  name: 'Pepperoni Pizza',
  slug: 'pepperoni-pizza',
  imageUrl: '/images/pepperoni-pizza.webp',
  description: 'Pepperoni slices, tomato sauce, mozzarella cheese.',
  price: 12,
  featured: true,
  categoryId: '4fbe4d4d',
  ...overrides,
});

const hawaiianPizza = createDish({
  id: '8aa3b12f-560e-4157-af53-4de19fa471a0',
  name: 'Hawaiian Pizza',
  slug: 'hawaiian-pizza',
  description: 'Pineapple slices, ham, mozzarella cheese and tomato sauce.',
});

describe('Test on menu <DishesGrid /> component', () => {
  test('Should render one dish card per dish', () => {
    render(<DishesGrid dishes={[createDish(), hawaiianPizza]} />);

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  test('Should render the name and the price of each dish', () => {
    render(<DishesGrid dishes={[createDish(), hawaiianPizza]} />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Pepperoni Pizza' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Hawaiian Pizza' }),
    ).toBeVisible();
    expect(screen.getAllByRole('status')).toHaveLength(2);
  });

  test('Should link each dish to its detail page', () => {
    render(<DishesGrid dishes={[createDish(), hawaiianPizza]} />);

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/menu/pepperoni-pizza');
    expect(links[1]).toHaveAttribute('href', '/menu/hawaiian-pizza');
  });

  test('Should render an empty grid when there are no dishes', () => {
    const { container } = render(<DishesGrid dishes={[]} />);

    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
    expect(container.firstElementChild?.children).toHaveLength(0);
  });
});
