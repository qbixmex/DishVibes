import { useShallow } from 'zustand/react/shallow';
import { calculateOrderTotals } from '@/lib/utils';
import type { OrderTotals } from '@/shared/interfaces/order.interface';
import { useOrderStore, type OrderState } from './order-store';

const roundCurrency = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export const selectOrderCount = (state: OrderState): number => {
  return state.lines.reduce((total, line) => total + line.quantity, 0);
};

export const selectSubtotal = (state: OrderState): number => {
  const subtotal = state.lines.reduce(
    (total, line) => total + line.dish.price * line.quantity,
    0,
  );

  return roundCurrency(subtotal);
};

export const selectDiscount = (state: OrderState): number => {
  return calculateOrderTotals(selectSubtotal(state), state.promoCode).discount;
};

export const selectOrderTotals = (state: OrderState): OrderTotals => {
  return calculateOrderTotals(selectSubtotal(state), state.promoCode);
};

export const useOrderCount = (): number => {
  return useOrderStore(selectOrderCount);
};

export const useOrderTotals = (): OrderTotals => {
  return useOrderStore(useShallow(selectOrderTotals));
};
