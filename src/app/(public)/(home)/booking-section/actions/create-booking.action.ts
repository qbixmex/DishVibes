'use server';

import { sleep } from '@/lib/utils';
import { bookingSchema } from '../booking-form/booking-schema';

export const createBookingAction = async (formData: FormData): Promise<{
  success: boolean;
  error: string | null;
}> => {
  const formValues = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    people: formData.has('people')
      ? Number(formData.get('people'))
      : 0,
    bookingDate: formData.has('bookingDate')
      ? new Date(formData.get('bookingDate') as string)
      : new Date(),
  };

  const result = bookingSchema.safeParse(formValues);

  await sleep(3);
 
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }
  
  console.log(result.data);

  return {
    success: true,
    error: null,
  };
};
