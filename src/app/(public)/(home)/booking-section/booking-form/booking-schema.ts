import z from 'zod';

export const bookingSchema = z.object({
  name: z
    .string("Name must be a valid string")
    .min(1, "Name is required")
    .min(3, "Name is must be 3 characters length")
    .max(100, "Name must be less than 100 characters"),
  phone: z
    .string("Phone must be a valid string")
    .min(1, "Phone is required")
    .min(10, "Phone must be more than 10 characters length")
    .max(20, "Phone must be less than 20 characters length"),
  people: z
    .number("People must be a valid number")
    .min(1, "People must be greater than 0"),
  bookingDate: z.date('Booking date must be a valid date'),
});
