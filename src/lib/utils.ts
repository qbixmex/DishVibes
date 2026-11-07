import { PROMO_CODES, TAX_RATE } from "@/shared/constants/order";
import type { OrderTotals } from "@/shared/interfaces/order.interface";

export { cn } from "cn";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Formats a number as US dollars.
 * ```ts
 * formatCurrency(12.95); // "$12.95"
 * ```
 */
export const formatCurrency = (value: number): string => {
  return currencyFormatter.format(value);
};

/**
 * Simulates an asynchronous request.
 * @param time time in seconds.
 * ```ts
 * sleep(2); // 2 seconds promise simulation.
 * ```
 * @returns a promise to be resolved.
 */
export const sleep = (time: number = 1): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time * 1000));
};

const roundCurrency = (value: number): number => {
  return Math.round(value * 100) / 100;
};

/**
 * Calculates the order totals from a subtotal and an optional promo code.
 * ```ts
 * calculateOrderTotals(24, 'DISH10');
 * // { subtotal: 24, discount: 2.4, tax: 1.78, total: 23.38 }
 * ```
 */
export const calculateOrderTotals = (
  subtotal: number,
  promoCode: string | null = null,
): OrderTotals => {
  const discountRate = promoCode ? (PROMO_CODES[promoCode] ?? 0) : 0;
  const discount = roundCurrency(subtotal * discountRate);
  const tax = roundCurrency((subtotal - discount) * TAX_RATE);

  return {
    subtotal: roundCurrency(subtotal),
    discount,
    tax,
    total: roundCurrency(subtotal - discount + tax),
  };
};
