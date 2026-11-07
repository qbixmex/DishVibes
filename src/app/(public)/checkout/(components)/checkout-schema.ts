import z from 'zod';

export const FULFILLMENT_OPTIONS = ['pickup', 'delivery'] as const;

export const checkoutSchema = z
  .object({
    name: z
      .string('Name must be a valid string')
      .trim()
      .min(3, 'Name must be at least 3 characters length')
      .max(100, 'Name must be less than 100 characters'),
    phone: z
      .string('Phone must be a valid string')
      .trim()
      .min(10, 'Phone must be at least 10 characters length')
      .max(20, 'Phone must be less than 20 characters length'),
    email: z
      .string('Email must be a valid string')
      .trim()
      .max(120, 'Email must be less than 120 characters')
      .refine(
        (value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        'Email must be a valid email address',
      ),
    fulfillment: z.enum(FULFILLMENT_OPTIONS, 'Choose a valid order type'),
    address: z
      .string('Address must be a valid string')
      .trim()
      .max(200, 'Address must be less than 200 characters')
      .optional(),
    notes: z
      .string('Notes must be a valid string')
      .trim()
      .max(250, 'Notes must be less than 250 characters')
      .optional(),
  })
  .superRefine((values, context) => {
    if (values.fulfillment === 'delivery' && !values.address?.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['address'],
        message: 'An address is required for delivery',
      });
    }
  });

export type CheckoutValues = z.infer<typeof checkoutSchema>;
