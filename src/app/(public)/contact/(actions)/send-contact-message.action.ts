'use server';

import { sleep } from '@/lib/utils';
import { contactSchema } from '../(components)/contact-form/contact-schema';

export type ContactActionResult = {
  success: boolean;
  error: string | null;
};

export const sendContactMessageAction = async (
  formData: FormData,
): Promise<ContactActionResult> => {
  const formValues = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    message: formData.get('message') as string,
  };

  const result = contactSchema.safeParse(formValues);

  await sleep(3);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  console.log('Contact message received', result.data);

  return {
    success: true,
    error: null,
  };
};
