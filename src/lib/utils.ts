export { cn } from "cn";

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
