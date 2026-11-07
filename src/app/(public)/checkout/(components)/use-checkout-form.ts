'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type { OrderLine } from '@/shared/interfaces/order.interface';
import { useOrderStore } from '@/shared/stores/order-store';
import { submitOrderAction } from '../(actions)/submit-order.action';
import { checkoutSchema, type CheckoutValues } from './checkout-schema';

type Params = Readonly<{
  lines: OrderLine[];
  onSuccess: (orderNumber: string) => void;
}>;

export const useCheckoutForm = ({ lines, onSuccess }: Params) => {
  const clearOrder = useOrderStore((state) => state.clearOrder);
  const promoCode = useOrderStore((state) => state.promoCode);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      fulfillment: 'pickup',
      address: '',
      notes: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: CheckoutValues) => {
    const response = await submitOrderAction({
      customer: values,
      promoCode,
      lines: lines.map((line) => ({
        dishId: line.dishId,
        quantity: line.quantity,
        specialInstructions: line.specialInstructions,
      })),
    });

    if (!response.success || !response.orderNumber) {
      toast.error('There was an error placing your order', {
        description: response.error,
        duration: 5000,
      });

      return;
    }

    clearOrder();

    toast.success('Order placed', {
      description: `Your order number is ${response.orderNumber}`,
      duration: 5000,
    });

    onSuccess(response.orderNumber);
  };

  return {
    form,
    onSubmit,
  };
};
