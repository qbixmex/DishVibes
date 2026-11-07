'use server';

import { calculateOrderTotals, sleep } from '@/lib/utils';
import { MAX_QUANTITY, MIN_QUANTITY } from '@/shared/constants/order';
import { dishes } from '@/shared/data/all-dishes';
import type { OrderTotals } from '@/shared/interfaces/order.interface';
import { checkoutSchema, type CheckoutValues } from '../(components)/checkout-schema';

export type SubmitOrderLine = {
  dishId: string;
  quantity: number;
  specialInstructions: string;
};

export type SubmitOrderInput = {
  customer: CheckoutValues;
  lines: SubmitOrderLine[];
  promoCode: string | null;
};

export type SubmitOrderResult = {
  success: boolean;
  error: string | null;
  orderNumber: string | null;
  totals: OrderTotals | null;
};

const failure = (error: string): SubmitOrderResult => ({
  success: false,
  error,
  orderNumber: null,
  totals: null,
});

const createOrderNumber = (): string => {
  return `DV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
};

export const submitOrderAction = async (
  input: SubmitOrderInput,
): Promise<SubmitOrderResult> => {
  await sleep(1);

  const validation = checkoutSchema.safeParse(input.customer);

  if (!validation.success) {
    return failure(validation.error.issues[0].message);
  }

  if (input.lines.length === 0) {
    return failure('Your order is empty');
  }

  // Prices always come from the menu data, never from the client.
  let subtotal = 0;

  for (const line of input.lines) {
    if (
      !Number.isInteger(line.quantity) ||
      line.quantity < MIN_QUANTITY ||
      line.quantity > MAX_QUANTITY
    ) {
      return failure('One of the order lines has an invalid quantity');
    }

    const dish = dishes.find((item) => item.id === line.dishId);

    if (!dish) {
      return failure('One of the dishes in your order is no longer available');
    }

    subtotal += dish.price * line.quantity;
  }

  const totals = calculateOrderTotals(subtotal, input.promoCode);

  return {
    success: true,
    error: null,
    orderNumber: createOrderNumber(),
    totals,
  };
};
