'use server';

import { sleep } from "@/lib/utils";
import { drinks } from "@/shared/data/drinks";
import type { OrderDishSnapshot } from "@/shared/interfaces/order.interface";

type ResponseAction = Readonly<{
  success: boolean;
  errors: null | string;
  suggestions: OrderDishSnapshot[];
}>;

export const getOrderSuggestions = async (): Promise<ResponseAction> => {
  await sleep(1);

  if (drinks.length === 0) {
    return {
      success: false,
      errors: 'There were no drinks available',
      suggestions: [],
    };
  }

  const suggestions = drinks.slice(0, 3).map((drink) => ({
    id: drink.id,
    name: drink.name,
    slug: drink.slug,
    imageUrl: drink.imageUrl,
    description: drink.description,
    price: drink.price,
  }));

  return {
    success: true,
    errors: null,
    suggestions,
  };
};
