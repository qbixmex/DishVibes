import z from 'zod';

export const contactSchema = z.object({
  fullName: z
    .string('Full name must be a valid string')
    .trim()
    .min(1, 'Full name is required')
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Full name must be less than 50 characters'),
  email: z
    .string('Email must be a valid string')
    .trim()
    .min(1, 'Email is required')
    .max(120, 'Email must be less than 120 characters')
    .pipe(z.email('Email must be a valid email address')),
  phone: z
    .string('Phone must be a valid string')
    .trim()
    .min(1, 'Phone is required')
    .max(50, 'Phone must be less than 50 characters'),
  message: z
    .string('Message must be a valid string')
    .trim()
    .min(1, 'Message is required')
    .max(255, 'Message must be 255 characters or less'),
});

export type ContactValues = z.infer<typeof contactSchema>;
