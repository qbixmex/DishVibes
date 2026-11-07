import { OrderSummary } from '@/app/(public)/orders/(components)/order-summary';
import { useOrderStore } from '@/shared/stores/order-store';
import { createOrderLine, resetOrderStore } from '@/tests/utils/order';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Tests on <OrderSummary /> component', () => {
  beforeEach(() => {
    resetOrderStore();
  });

  test('Should render the derived totals', () => {
    useOrderStore.setState({ lines: [createOrderLine({ quantity: 2 })] });

    render(<OrderSummary />);

    expect(screen.getByText('Subtotal')).toBeVisible();
    expect(screen.getByText('$20.00')).toBeVisible();
    expect(screen.getByText('Tax')).toBeVisible();
    expect(screen.getByText('$1.65')).toBeVisible();
    expect(screen.getByTestId('order-total')).toHaveTextContent('$21.65');
  });

  test('Should link the checkout button to the checkout page', () => {
    useOrderStore.setState({ lines: [createOrderLine()] });

    render(<OrderSummary />);

    expect(screen.getByRole('link', { name: 'Checkout' })).toHaveAttribute(
      'href',
      '/checkout',
    );
  });

  test('Should disable checkout when the order is empty', () => {
    render(<OrderSummary />);

    expect(screen.getByRole('button', { name: 'Checkout' })).toBeDisabled();
  });

  test('Should apply a valid promo code', async () => {
    const user = userEvent.setup();

    useOrderStore.setState({ lines: [createOrderLine({ quantity: 2 })] });

    render(<OrderSummary />);

    await user.type(screen.getByLabelText('Promo code'), 'DISH10');
    await user.click(screen.getByRole('button', { name: /apply/i }));

    expect(useOrderStore.getState().promoCode).toBe('DISH10');
    expect(screen.getByText('Discount (DISH10)')).toBeVisible();
    expect(screen.getByText('-$2.00')).toBeVisible();
    expect(screen.getByTestId('order-total')).toHaveTextContent('$19.49');
  });

  test('Should reject an invalid promo code', async () => {
    const user = userEvent.setup();
    const { toast } = await import('sonner');

    useOrderStore.setState({ lines: [createOrderLine()] });

    render(<OrderSummary />);

    await user.type(screen.getByLabelText('Promo code'), 'NOPE');
    await user.click(screen.getByRole('button', { name: /apply/i }));

    expect(useOrderStore.getState().promoCode).toBeNull();
    expect(toast.error).toHaveBeenCalled();
  });

  test('Should remove an applied promo code', async () => {
    const user = userEvent.setup();

    useOrderStore.setState({
      lines: [createOrderLine({ quantity: 2 })],
      promoCode: 'DISH10',
    });

    render(<OrderSummary />);

    await user.click(screen.getByRole('button', { name: /remove dish10/i }));

    expect(useOrderStore.getState().promoCode).toBeNull();
    expect(screen.queryByText('Discount (DISH10)')).not.toBeInTheDocument();
  });
});
