'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema } from './booking-schema';
import { toast } from 'sonner';
import { createBookingAction } from '../actions/create-booking.action';
import type z from 'zod';

export const useBookingForm = () => {
  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      phone: '',
      people: 0,
      bookingDate: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('people', data.people.toString());
    formData.append('bookingDate', data.bookingDate.toISOString());

    const response = await createBookingAction(formData);

    if (!response.success) {
      toast.error('There was an error on the form', {
        description: response.error,
        duration: 5000,
      });
      return;
    }

    form.reset();

    toast.success('Booking created successfully', {
      description: 'Your reservation is made, check your email address for confirmation.',
      className: 'text-balance',
      duration: 5000,
    });
  };

  return {
    form,
    onSubmit,
  };
};
