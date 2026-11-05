'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { dishOrderSchema, type DishOrderValues } from './dish-order-schema';


export const useDishOrderForm = (price: number) => {
  const form = useForm<DishOrderValues>({
    resolver: zodResolver(dishOrderSchema),
    defaultValues: {
      quantity: 1,
      specialInstructions: '',
    },
    mode: 'onChange',
  });

  const quantity = useWatch({ control: form.control, name: 'quantity' });
  const total = price * (Number(quantity) || 1);

  const onSubmit = (data: z.infer<typeof dishOrderSchema>) => {
    // TODO: implement adding the dish to the order once the orders feature lands.
    console.log(data);
    return;
  };

  return {
    form,
    total,
    onSubmit,
  };
};
