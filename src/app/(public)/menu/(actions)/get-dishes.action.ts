'use server';

import { dishes } from "@/shared/data/all-dishes";
import { firstCategoryId, resolveCategory } from "@/shared/data/categories";
import type { Dish } from "@/shared/interfaces/dish.interface";
import { searchDishes } from "@/lib/dish-search";
import { sleep } from '../../../../lib/utils';

type ResponseAction = Promise<{
  success: boolean;
  error: null | string;
  dishes: Dish[];
  pagination: null | {
    currentPage: number;
    totalPages: number;
  }
}>;

const shuffle = (items: Dish[]): Dish[] => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

const orderDishes = (items: Dish[], randomize: boolean): Dish[] => {
  const featuredDishes = items.filter((dish) => dish.featured);
  const regularDishes = items.filter((dish) => !dish.featured);

  if (!randomize) {
    return [...featuredDishes, ...regularDishes];
  }

  return [...shuffle(featuredDishes), ...shuffle(regularDishes)];
};

const toPositiveInteger = (value: number, fallback: number): number => {
  if (!Number.isFinite(value)) return fallback;

  const integer = Math.trunc(value);

  return integer > 0 ? integer : fallback;
};

export const getDishesAction = async ({
  category,
  search,
  page = 1,
  take = 4,
}: {
  category?: string | null;
  search?: string | null;
  page?: number,
  take?: number;
}): ResponseAction => {
  await sleep(1);
  const requestedPage = toPositiveInteger(page, 1);
  const pageSize = toPositiveInteger(take, 4);
  const searchTerm = search?.trim() ?? '';
  const resolvedCategory = resolveCategory(category);

  if (category && !resolvedCategory) {
    return {
      success: false,
      error: 'There is no dishes with selected category',
      dishes: [],
      pagination: null,
    };
  }

  const belongsToCategory = (dish: Dish): boolean => {
    if (!resolvedCategory) return true;
    if (resolvedCategory.id === firstCategoryId) return dish.featured;

    return dish.categoryId === resolvedCategory.id;
  };

  const filteredDishes = searchTerm
    ? searchDishes(searchTerm).dishes.filter(belongsToCategory)
    : dishes.filter(belongsToCategory);

  if (filteredDishes.length === 0) {
    return {
      success: false,
      error: searchTerm
        ? 'There is no dishes matching your search'
        : 'There is no dishes with selected category',
      dishes: [],
      pagination: null,
    };
  }

  // Without a category the whole list is randomized, but featured dishes
  // always come first. With a category the original order is preserved.
  // Search results keep their relevance order.
  const orderedDishes = searchTerm
    ? filteredDishes
    : orderDishes(filteredDishes, !resolvedCategory);
  const totalPages = Math.ceil(orderedDishes.length / pageSize);
  const currentPage = Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * pageSize;
  const paginatedDishes = orderedDishes.slice(start, start + pageSize);

  return {
    success: true,
    error: null,
    dishes: paginatedDishes,
    pagination: {
      currentPage,
      totalPages,
    },
  };
};
