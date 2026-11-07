import type { Dish } from "./dish.interface";

/**
 * The dish fields kept on an order line so the orders page can render
 * without fetching the dish again. Prices are re-validated on checkout.
 */
export type OrderDishSnapshot = Pick<
  Dish,
  "id" | "name" | "slug" | "imageUrl" | "description" | "price"
>;

export interface OrderLine {
  /** Unique identifier of the order line. */
  lineId: string;
  /** Identifier of the dish the line refers to. */
  dishId: string;
  /** Number of units of the dish. */
  quantity: number;
  /** Special instructions for this line, empty when there are none. */
  specialInstructions: string;
  /** Dish data used for display. */
  dish: OrderDishSnapshot;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}
