import { DishOrderForm } from '@/app/(public)/menu/[slug]/dish-order-form';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
    render(<DishOrderForm price={12.95} />);

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
