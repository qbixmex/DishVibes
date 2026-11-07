import { CheckoutView } from '@/app/(public)/checkout/(components)/checkout-view';
import { useOrderStore } from '@/shared/stores/order-store';
import { createOrderLine, resetOrderStore } from '@/tests/utils/order';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mocks = vi.hoisted(() => ({
  submitOrderAction: vi.fn(),
}));

vi.mock('@/app/(public)/checkout/(actions)/submit-order.action', () => ({
  submitOrderAction: mocks.submitOrderAction,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderWithLine = () => {
  useOrderStore.setState({
    lines: [
      createOrderLine({
        quantity: 2,
        specialInstructions: 'No onions',
      }),
    ],
  });

  return render(<CheckoutView />);
};

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Full name'), 'Jane Doe');
  await user.type(screen.getByLabelText('Phone'), '5551234567');
};

describe('Tests on <CheckoutView /> component', () => {
  beforeEach(() => {
    resetOrderStore();
  });

  test('Should render the empty state when the order is empty', () => {
    render(<CheckoutView />);

    expect(
      screen.getByText(/your order is empty/i),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: /explore the menu/i })).toHaveAttribute(
      'href',
      '/menu',
    );
  });

  test('Should render a skeleton while the order is not hydrated', () => {
    useOrderStore.setState({ hydrated: false });

    const { container } = render(<CheckoutView />);

    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);
  });

  test('Should render the form and the order summary', () => {
    renderWithLine();

    expect(screen.getByRole('heading', { level: 1, name: 'Checkout' })).toBeVisible();
    expect(screen.getByLabelText('Full name')).toBeVisible();
    expect(screen.getByLabelText('Phone')).toBeVisible();
    expect(screen.getByLabelText('Order type')).toBeVisible();
    expect(screen.getByText('No onions')).toBeVisible();
  });

  test('Should show the delivery address only for delivery orders', async () => {
    const user = userEvent.setup();

    renderWithLine();

    expect(screen.queryByLabelText('Delivery address')).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Order type'), 'delivery');

    expect(screen.getByLabelText('Delivery address')).toBeVisible();
  });

  test('Should submit the order and show the confirmation', async () => {
    const user = userEvent.setup();

    mocks.submitOrderAction.mockResolvedValue({
      success: true,
      error: null,
      orderNumber: 'DV-TEST01',
      totals: { subtotal: 20, discount: 0, tax: 1.65, total: 21.65 },
    });

    renderWithLine();

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Place order' }));

    await waitFor(() => {
      expect(screen.getByTestId('checkout-success')).toBeVisible();
    });

    expect(screen.getByText('DV-TEST01')).toBeVisible();
    expect(useOrderStore.getState().lines).toEqual([]);
    expect(mocks.submitOrderAction).toHaveBeenCalledWith({
      customer: expect.objectContaining({
        name: 'Jane Doe',
        phone: '5551234567',
        fulfillment: 'pickup',
      }),
      promoCode: null,
      lines: [
        {
          dishId: 'dish-1',
          quantity: 2,
          specialInstructions: 'No onions',
        },
      ],
    });
  });

  test('Should keep the order when the action fails', async () => {
    const user = userEvent.setup();

    mocks.submitOrderAction.mockResolvedValue({
      success: false,
      error: 'Something went wrong',
      orderNumber: null,
      totals: null,
    });

    renderWithLine();

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Place order' }));

    await waitFor(() => {
      expect(mocks.submitOrderAction).toHaveBeenCalled();
    });

    expect(screen.queryByTestId('checkout-success')).not.toBeInTheDocument();
    expect(useOrderStore.getState().lines).toHaveLength(1);
  });
});
