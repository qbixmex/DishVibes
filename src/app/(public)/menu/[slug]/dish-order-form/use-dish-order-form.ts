'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type z from 'zod';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { toOrderDishSnapshot, useOrderStore } from '@/shared/stores/order-store';
import { dishOrderSchema, type DishOrderValues } from './dish-order-schema';

export const useDishOrderForm = (dish: Dish) => {
  const addLine = useOrderStore((state) => state.addLine);

  const form = useForm<DishOrderValues>({
    resolver: zodResolver(dishOrderSchema),
    defaultValues: {
      quantity: 1,
      specialInstructions: '',
    },
    mode: 'onChange',
  });

  const quantity = useWatch({ control: form.control, name: 'quantity' });
  const total = dish.price * (Number(quantity) || 1);

  const onSubmit = (data: z.infer<typeof dishOrderSchema>) => {
    addLine({
      dishId: dish.id,
      quantity: data.quantity,
      specialInstructions: data.specialInstructions ?? '',
      dish: toOrderDishSnapshot(dish),
    });

    toast.success(`${dish.name} added to your order`, {
      description: data.quantity === 1 ? '1 unit' : `${data.quantity} units`,
    });
  };

  return {
    form,
    total,
    onSubmit,
  };
};
