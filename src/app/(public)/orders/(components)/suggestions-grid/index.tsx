import type { FC } from "react";
import { OrderSuggestions } from "../order-suggestions";
import { getOrderSuggestions } from "../../(actions)/get-orders-suggestions";

export const SuggestionsGrid: FC = async () => {
  const { success, suggestions } = await getOrderSuggestions();

  if (!success || suggestions.length === 0) return null;

  return (
    <OrderSuggestions suggestions={suggestions} />
  );
};
