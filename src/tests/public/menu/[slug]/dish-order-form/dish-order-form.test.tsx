import { DishOrderForm } from '@/app/(public)/menu/[slug]/dish-order-form';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const dish: Dish = {
  id: 'd2f9d32f-fa53-4848-a8dc-675fce14641a',
  name: 'Pepperoni Pizza',
  slug: 'pepperoni-pizza',
  imageUrl: '/images/pizzas/pepperoni-pizza.png',
  description: 'Pepperoni slices, mozzarella cheese and tomato sauce.',
  price: 12.95,
  featured: true,
  categoryId: '4fbe4d4d',
};

const { mockOnSubmit } = vi.hoisted(() => ({ mockOnSubmit: vi.fn() }));

vi.mock(
  '@/app/(public)/menu/[slug]/dish-order-form/use-dish-order-form',
  async () => {
    const { useForm } = await import('react-hook-form');

    return {
      useDishOrderForm: () => ({
        form: useForm({
          defaultValues: {
            quantity: 2,
            specialInstructions: 'No onions, please',
          },
        }),
        onSubmit: mockOnSubmit,
        total: 25.9,
      }),
    };
  },
);

describe('Tests on <DishOrderForm /> component', () => {
  const renderComponent = () => {
    render(<DishOrderForm dish={dish} />);

    return { user: userEvent.setup() };
  };

  test('Should render the special instructions field', () => {
    renderComponent();

    const textarea = screen.getByLabelText(/special instructions/i);

    expect(textarea).toBeVisible();
    expect(textarea).toHaveValue('No onions, please');
  });

  test('Should render the quantity of the current form values', () => {
    renderComponent();

    expect(screen.getByRole('spinbutton', { name: /quantity/i })).toHaveValue(2);
  });

  test('Should render the total price', () => {
    renderComponent();

    expect(screen.getByText('Total')).toBeVisible();
    expect(screen.getByText('$25.90')).toBeVisible();
  });

  test('Should render a submit button to add the dish to the order', () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /add to order/i });

    expect(submitButton).toBeVisible();
    expect(submitButton).toBeEnabled();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('Should submit the form with the current values', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByRole('button', { name: /add to order/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: 2,
          specialInstructions: 'No onions, please',
        }),
        expect.anything(),
      );
    });
  });
});
