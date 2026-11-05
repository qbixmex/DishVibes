'use server';

import { dishes } from '@/shared/data/all-dishes';
import type { Dish } from '@/shared/interfaces/dish.interface';

export type GetDishBySlugResult = {
  success: boolean;
  dish: Dish | null;
  error: null | string;
}

/**
 * Simulates `SELECT slug FROM dishes` until a real database is wired up.
 */
export const getDishSlugs = async (): Promise<string[]> => {
  return dishes.map((dish) => dish.slug);
};

export const getDishBySlug = async (slug: string): Promise<GetDishBySlugResult> => {
  const dish = dishes.find((dish) => dish.slug === slug);

  if (!dish) {
    return {
      success: false,
      dish: null,
      error: `Dish with slug [${slug}] not found`,
    };
  }

  return {
    success: true,
    dish,
    error: null,
  };
};
