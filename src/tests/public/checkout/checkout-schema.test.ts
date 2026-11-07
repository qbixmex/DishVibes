import {
  checkoutSchema,
  type CheckoutValues,
} from '@/app/(public)/checkout/(components)/checkout-schema';

const validValues: CheckoutValues = {
  name: 'Jane Doe',
  phone: '5551234567',
  email: '',
  fulfillment: 'pickup',
  address: '',
  notes: '',
};

const parseWith = (overrides: Partial<CheckoutValues> = {}) =>
  checkoutSchema.safeParse({ ...validValues, ...overrides });

describe('Tests on the checkout schema', () => {
  test('Should accept a valid pickup order', () => {
    expect(parseWith().success).toBe(true);
  });

  test('Should accept a valid delivery order with an address', () => {
    const result = parseWith({
      fulfillment: 'delivery',
      address: '123 Main Street',
    });

    expect(result.success).toBe(true);
  });

  test('Should require an address for delivery', () => {
    const result = parseWith({ fulfillment: 'delivery', address: '' });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ['address'],
        message: 'An address is required for delivery',
      });
    }
  });

  test('Should accept an optional valid email', () => {
    expect(parseWith({ email: 'jane@example.com' }).success).toBe(true);
  });

  test('Should reject an invalid email', () => {
    const result = parseWith({ email: 'not-an-email' });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Email must be a valid email address',
      );
    }
  });

  test('Should reject a short name', () => {
    expect(parseWith({ name: 'Al' }).success).toBe(false);
  });

  test('Should reject a short phone number', () => {
    expect(parseWith({ phone: '123' }).success).toBe(false);
  });

  test('Should reject an invalid order type', () => {
    const result = checkoutSchema.safeParse({
      ...validValues,
      fulfillment: 'teleport',
    });

    expect(result.success).toBe(false);
  });
});
