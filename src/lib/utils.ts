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
