import { DishItem } from '@/app/(public)/orders/(components)/dish-item';
import { useOrderStore } from '@/shared/stores/order-store';
import { createOrderLine, resetOrderStore } from '@/tests/utils/order';
import { fireEvent, isInaccessible, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

const renderItem = (overrides: Parameters<typeof createOrderLine>[0] = {}) => {
  const line = createOrderLine(overrides);

  useOrderStore.setState({ lines: [line] });

  return render(<DishItem line={line} />);
};

describe('Tests on the orders <DishItem /> component', () => {
  beforeEach(() => {
    resetOrderStore();
  });

  test('Should render the dish name, description and prices', () => {
    renderItem({ quantity: 2 });

    expect(
      screen.getByRole('link', { name: 'Pepperoni Pizza' }),
    ).toHaveAttribute('href', '/menu/pepperoni-pizza');
    expect(
      screen.getByText('Pepperoni slices, mozzarella cheese and tomato sauce.'),
    ).toBeVisible();
    expect(screen.getByText('$10.00', { exact: false })).toBeVisible();
    expect(screen.getByText('$20.00')).toBeVisible();
  });

  test('Should render the special instructions when there are some', () => {
    renderItem({ specialInstructions: 'No onions, please' });

    expect(screen.getByText('No onions, please')).toBeVisible();
  });

  test('Should not render special instructions when the line has none', () => {
    renderItem();

    expect(screen.queryByText('No onions, please')).not.toBeInTheDocument();
  });

  test('Should render the dish image from the snapshot url', () => {
    renderItem();

    const image = screen.getByAltText('Pepperoni Pizza dish');

    expect(image.getAttribute('src')).toContain('pepperoni-pizza.png');
  });

  test('Should render a placeholder when the dish has no image', () => {
    renderItem({ dish: { imageUrl: '' } });

    const placeholder = screen.getByTestId('image-placeholder');
    const icons = placeholder.getElementsByTagName('svg');

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(placeholder).toBeVisible();
    expect(icons).toHaveLength(2);

    for (const icon of icons) {
      expect(isInaccessible(icon)).toBe(true);
    }
  });

  test('Should increase the line quantity', async () => {
    const user = userEvent.setup();

    renderItem({ quantity: 2 });

    await user.click(
      screen.getByRole('button', {
        name: 'Increase quantity of Pepperoni Pizza',
      }),
    );

    expect(useOrderStore.getState().lines[0].quantity).toBe(3);
  });

  test('Should decrease the line quantity', async () => {
    const user = userEvent.setup();

    renderItem({ quantity: 2 });

    await user.click(
      screen.getByRole('button', {
        name: 'Decrease quantity of Pepperoni Pizza',
      }),
    );

    expect(useOrderStore.getState().lines[0].quantity).toBe(1);
  });

  test('Should disable the decrement button at the minimum quantity', () => {
    renderItem({ quantity: 1 });

    expect(
      screen.getByRole('button', {
        name: 'Decrease quantity of Pepperoni Pizza',
      }),
    ).toBeDisabled();
  });

  test('Should disable the increment button at the maximum quantity', () => {
    renderItem({ quantity: 20 });

    expect(
      screen.getByRole('button', {
        name: 'Increase quantity of Pepperoni Pizza',
      }),
    ).toBeDisabled();
  });

  test('Should update the quantity from the input', () => {
    renderItem({ quantity: 1 });

    const input = screen.getByRole('spinbutton', {
      name: 'Quantity of Pepperoni Pizza',
    });

    fireEvent.change(input, { target: { value: '4' } });

    expect(useOrderStore.getState().lines[0].quantity).toBe(4);
  });

  test('Should clamp an invalid quantity from the input', () => {
    renderItem({ quantity: 3 });

    const input = screen.getByRole('spinbutton', {
      name: 'Quantity of Pepperoni Pizza',
    });

    fireEvent.change(input, { target: { value: '99' } });

    expect(useOrderStore.getState().lines[0].quantity).toBe(20);
  });

  test('Should remove the line when the remove button is clicked', async () => {
    const user = userEvent.setup();

    renderItem();

    await user.click(
      screen.getByRole('button', {
        name: 'Remove Pepperoni Pizza from order',
      }),
    );

    expect(useOrderStore.getState().lines).toHaveLength(0);
  });
});
