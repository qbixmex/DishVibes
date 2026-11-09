'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type { ContactValues } from './contact-schema';
import { contactSchema } from './contact-schema';
import { sendContactMessageAction } from '../../(actions)/send-contact-message.action';

export const CONTACT_FORM_DEFAULT_VALUES: ContactValues = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
};

export const useContactForm = () => {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: CONTACT_FORM_DEFAULT_VALUES,
  });

  const onSubmit = async (data: ContactValues) => {
    const formData = new FormData();

    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('message', data.message);

    const response = await sendContactMessageAction(formData);

    if (!response.success) {
      toast.error('There was an error sending your message', {
        description: response.error,
        duration: 5000,
      });
      return;
    }

    form.reset(CONTACT_FORM_DEFAULT_VALUES);

    toast.success('Message sent successfully', {
      description: 'Thanks for reaching out. We will get back to you soon.',
      className: 'text-balance',
      duration: 5000,
    });
  };

  return {
    form,
    onSubmit,
  };
};
