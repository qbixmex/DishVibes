import type { Dish } from "@/shared/interfaces/dish.interface";
import { dishes } from "@/shared/data/all-dishes";

const requests = new Map<string, Promise<Dish[]>>();

export const getHomeDishes = ({
  categoryId,
  limit,
}: {
  categoryId: string | null;
  limit: number;
}): Promise<Dish[]> => {
  const key = `${categoryId ?? 'category-id'}_limit-${limit}`;

  const cachedDish = requests.get(key);

  if (cachedDish) return cachedDish;

  const request = new Promise<Dish[]>((resolve) => {
    const resultDishes: Dish[] = [];

    for (const dish of dishes) {
      if (resultDishes.length >= limit) break;
      if (
        (categoryId === null && dish.featured === false) ||
        (categoryId !== null && categoryId !== dish.categoryId)
      ) continue;
      resultDishes.push(dish);
    }

    resolve(resultDishes);
  });

  requests.set(key, request);

  return request;
};
