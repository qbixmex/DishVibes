import { submitOrderAction } from '@/app/(public)/checkout/(actions)/submit-order.action';
import type { CheckoutValues } from '@/app/(public)/checkout/(components)/checkout-schema';
import { dishes } from '@/shared/data/all-dishes';
import type * as Utils from '@/lib/utils';

vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof Utils>();

  return {
    ...actual,
    sleep: vi.fn(),
  };
});

const dish = dishes[0];

const customer: CheckoutValues = {
  name: 'Jane Doe',
  phone: '5551234567',
  email: '',
  fulfillment: 'pickup',
  address: '',
  notes: '',
};

const createInput = (overrides: Partial<Parameters<typeof submitOrderAction>[0]> = {}) => ({
  customer,
  promoCode: null,
  lines: [
    {
      dishId: dish.id,
      quantity: 2,
      specialInstructions: '',
    },
  ],
  ...overrides,
});

describe('Tests on the submitOrderAction() server action', () => {
  test('Should submit a valid order and return an order number', async () => {
    const result = await submitOrderAction(createInput());

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(result.orderNumber).toMatch(/^DV-/);
    expect(result.totals?.subtotal).toBeCloseTo(dish.price * 2, 2);
  });

  test('Should re-price the order from the menu data', async () => {
    const result = await submitOrderAction(
      createInput({
        lines: [
          {
            dishId: dish.id,
            quantity: 1,
            specialInstructions: '',
          },
        ],
      }),
    );

    expect(result.totals?.subtotal).toBeCloseTo(dish.price, 2);
  });

  test('Should apply a valid promo code', async () => {
    const result = await submitOrderAction(createInput({ promoCode: 'DISH10' }));

    expect(result.totals?.discount).toBeCloseTo(dish.price * 2 * 0.1, 2);
  });

  test('Should fail when the order is empty', async () => {
    const result = await submitOrderAction(createInput({ lines: [] }));

    expect(result.success).toBe(false);
    expect(result.error).toBe('Your order is empty');
    expect(result.orderNumber).toBeNull();
  });

  test('Should fail when a dish is not available', async () => {
    const result = await submitOrderAction(
      createInput({
        lines: [
          {
            dishId: 'missing-dish',
            quantity: 1,
            specialInstructions: '',
          },
        ],
      }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      'One of the dishes in your order is no longer available',
    );
  });

  test('Should fail when a quantity is out of range', async () => {
    const result = await submitOrderAction(
      createInput({
        lines: [
          {
            dishId: dish.id,
            quantity: 0,
            specialInstructions: '',
          },
        ],
      }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('One of the order lines has an invalid quantity');
  });

  test('Should validate the customer details', async () => {
    const result = await submitOrderAction(
      createInput({ customer: { ...customer, name: 'Al' } }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('Name must be at least 3 characters length');
  });
});
