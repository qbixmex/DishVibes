import { DishItem } from '@/app/(public)/(components)/dish-item';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { useOrderStore } from '@/shared/stores/order-store';
import { resetOrderStore } from '@/tests/utils/order';
import { isInaccessible, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

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
  beforeEach(() => {
    resetOrderStore();
  });

  test('Should add the dish to the order when the CTA is clicked', async () => {
    const user = userEvent.setup();

    render(<DishItem dish={createDish()} />);

    await user.click(screen.getByRole('button', { name: /add order/i }));

    expect(useOrderStore.getState().lines).toEqual([
      expect.objectContaining({
        dishId: '029a42b3-9914-492a-bd70-f0d2c4742b19',
        quantity: 1,
        specialInstructions: '',
        dish: expect.objectContaining({ name: 'Pepperoni Pizza' }),
      }),
    ]);
  });

  test('Should merge repeated additions of the same dish', async () => {
    const user = userEvent.setup();

    render(<DishItem dish={createDish()} />);

    const button = screen.getByRole('button', { name: /add order/i });

    await user.click(button);
    await user.click(button);

    expect(useOrderStore.getState().lines).toHaveLength(1);
    expect(useOrderStore.getState().lines[0].quantity).toBe(2);
  });

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

  test('Should render a featured badge when the dish is featured', () => {
    render(<DishItem dish={createDish({ featured: true })} />);

    const badge = screen.getByTestId('featured-badge');

    expect(badge).toBeVisible();
    expect(badge).toHaveTextContent('Featured');
  });

  test('Should not render a featured badge when the dish is not featured', () => {
    render(<DishItem dish={createDish({ featured: false })} />);

    expect(screen.queryByTestId('featured-badge')).not.toBeInTheDocument();
  });

  test('Should render the dish image with a descriptive alt text', () => {
    render(<DishItem dish={createDish()} />);

    const image = screen.getByAltText(/pepperoni pizza/i);

    expect(image.getAttribute('src')).toContain('pepperoni-pizza.webp');
  });

  test('Should link the image and the title to the dish page', () => {
    render(<DishItem dish={createDish()} />);

    const titleLink = screen.getByRole('link', { name: 'Pepperoni Pizza' });
    const image = screen.getByAltText(/pepperoni pizza/i);
    const imageLink = image.closest('a');

    expect(titleLink).toHaveAttribute('href', '/menu/pepperoni-pizza');
    expect(imageLink).toHaveAttribute('href', '/menu/pepperoni-pizza');
  });

  test('Should expose only one accessible link per dish', () => {
    render(<DishItem dish={createDish()} />);

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName('Pepperoni Pizza');
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
