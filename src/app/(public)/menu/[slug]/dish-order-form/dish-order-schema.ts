import z from 'zod';

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 20;

export const dishOrderSchema = z.object({
  quantity: z
    .number('Quantity must be a valid number')
    .int('Quantity must be a whole number')
    .min(MIN_QUANTITY, `Minimum quantity is ${MIN_QUANTITY}`)
    .max(MAX_QUANTITY, `Maximum quantity is ${MAX_QUANTITY}`),
  specialInstructions: z
    .string('Special instructions must be a valid text')
    .max(250, 'Special instructions must be less than 250 characters')
    .refine(
      (value) => value.trim() === '' || value.trim().length >= 4,
      'Special instructions must be more than 4 characters',
    )
    .optional(),
});

export type DishOrderValues = z.infer<typeof dishOrderSchema>;
