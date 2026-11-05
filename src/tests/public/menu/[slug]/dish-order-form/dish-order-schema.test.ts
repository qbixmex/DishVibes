import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  dishOrderSchema,
} from '@/app/(public)/menu/[slug]/dish-order-form/dish-order-schema';

const parseWith = (values: Partial<{ quantity: unknown; specialInstructions: unknown }>) => {
  return dishOrderSchema.safeParse({
    quantity: 1,
    specialInstructions: '',
    ...values,
  });
};

const errorOf = (result: ReturnType<typeof parseWith>, field: string) => {
  if (result.success) return undefined;

  return result.error.issues.find((issue) => issue.path[0] === field)?.message;
};

describe('Tests on dishOrderSchema', () => {
  test('Should accept the form default values', () => {
    const result = parseWith({ quantity: 1, specialInstructions: '' });

    expect(result.success).toBe(true);
  });

  describe('quantity', () => {
    test('Should accept the minimum and maximum quantity', () => {
      expect(parseWith({ quantity: MIN_QUANTITY }).success).toBe(true);
      expect(parseWith({ quantity: MAX_QUANTITY }).success).toBe(true);
    });

    test('Should reject a quantity below the minimum', () => {
      const result = parseWith({ quantity: MIN_QUANTITY - 1 });

      expect(errorOf(result, 'quantity')).toBe(
        `Minimum quantity is ${MIN_QUANTITY}`,
      );
    });

    test('Should reject a quantity above the maximum', () => {
      const result = parseWith({ quantity: MAX_QUANTITY + 1 });

      expect(errorOf(result, 'quantity')).toBe(
        `Maximum quantity is ${MAX_QUANTITY}`,
      );
    });

    test('Should reject a decimal quantity', () => {
      const result = parseWith({ quantity: 1.5 });

      expect(errorOf(result, 'quantity')).toBe(
        'Quantity must be a whole number',
      );
    });

    test('Should reject a value that is not a number', () => {
      const result = parseWith({ quantity: '2' });

      expect(errorOf(result, 'quantity')).toBe(
        'Quantity must be a valid number',
      );
    });
  });

  describe('specialInstructions', () => {
    test('Should accept an empty value because the field is optional', () => {
      expect(parseWith({ specialInstructions: '' }).success).toBe(true);
    });

    test('Should accept an undefined value', () => {
      expect(parseWith({ specialInstructions: undefined }).success).toBe(true);
    });

    test('Should accept a whitespace only value as empty', () => {
      expect(parseWith({ specialInstructions: '   ' }).success).toBe(true);
    });

    test('Should accept four characters', () => {
      expect(parseWith({ specialInstructions: 'abcd' }).success).toBe(true);
    });

    test('Should reject less than four characters when a value is provided', () => {
      const result = parseWith({ specialInstructions: 'abc' });

      expect(errorOf(result, 'specialInstructions')).toBe(
        'Special instructions must be more than 4 characters',
      );
    });

    test('Should reject more than 250 characters', () => {
      const result = parseWith({ specialInstructions: 'a'.repeat(251) });

      expect(errorOf(result, 'specialInstructions')).toBe(
        'Special instructions must be less than 250 characters',
      );
    });

    test('Should accept exactly 250 characters', () => {
      expect(parseWith({ specialInstructions: 'a'.repeat(250) }).success).toBe(
        true,
      );
    });

    test('Should reject a value that is not a string', () => {
      const result = parseWith({ specialInstructions: 42 });

      expect(errorOf(result, 'specialInstructions')).toBe(
        'Special instructions must be a valid text',
      );
    });
  });
});
