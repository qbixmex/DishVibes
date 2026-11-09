import { contactSchema } from '@/app/(public)/contact/(components)/contact-form/contact-schema';

const validValues = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 232-555-1232',
  message: 'I would like to know more about your menu.',
};

const parse = (overrides: Partial<typeof validValues> = {}) =>
  contactSchema.safeParse({ ...validValues, ...overrides });

describe('Tests on contactSchema', () => {
  test('Should accept a fully valid payload', () => {
    const result = parse();

    expect(result.success).toBe(true);
  });

  test('Should trim every string field', () => {
    const result = parse({
      fullName: '  John Doe  ',
      email: '  john.doe@example.com  ',
      phone: '  +1 232-555-1232  ',
      message: '  I would like to know more about your menu.  ',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual(validValues);
    }
  });

  describe('fullName', () => {
    test('Should reject an empty name', () => {
      const result = parse({ fullName: '' });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Full name is required');
      }
    });

    test('Should reject a name shorter than three characters', () => {
      const result = parse({ fullName: 'ab' });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Full name must be at least 3 characters',
        );
      }
    });

    test('Should accept a name with exactly fifty characters', () => {
      expect(parse({ fullName: 'a'.repeat(50) }).success).toBe(true);
    });

    test('Should reject a name longer than fifty characters', () => {
      const result = parse({ fullName: 'a'.repeat(51) });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Full name must be less than 50 characters',
        );
      }
    });
  });

  describe('email', () => {
    test('Should reject an empty email', () => {
      const result = parse({ email: '' });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email is required');
      }
    });

    test.each([
      'plainaddress',
      'missing-at.example.com',
      'missing-domain@',
      'spaces in@example.com',
    ])('Should reject the invalid email "%s"', (email) => {
      const result = parse({ email });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Email must be a valid email address',
        );
      }
    });

    test('Should reject an email longer than one hundred and twenty characters', () => {
      const email = `${'a'.repeat(110)}@example.com`;
      const result = parse({ email });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Email must be less than 120 characters',
        );
      }
    });
  });

  describe('phone', () => {
    test('Should reject an empty phone', () => {
      const result = parse({ phone: '' });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Phone is required');
      }
    });

    test('Should accept a phone with exactly fifty characters', () => {
      expect(parse({ phone: '1'.repeat(50) }).success).toBe(true);
    });

    test('Should reject a phone longer than fifty characters', () => {
      const result = parse({ phone: '1'.repeat(51) });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Phone must be less than 50 characters',
        );
      }
    });
  });

  describe('message', () => {
    test('Should reject an empty message', () => {
      const result = parse({ message: '' });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Message is required');
      }
    });

    test('Should accept a message with exactly 255 characters', () => {
      expect(parse({ message: 'a'.repeat(255) }).success).toBe(true);
    });

    test('Should reject a message longer than 255 characters', () => {
      const result = parse({ message: 'a'.repeat(256) });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Message must be 255 characters or less',
        );
      }
    });
  });
});
