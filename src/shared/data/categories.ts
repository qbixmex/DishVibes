import {
  CakeSlice,
  CupSoda,
  Drumstick,
  Hamburger,
  LayoutGrid,
  Pizza,
  Salad,
  Soup,
  UtensilsCrossed,
} from 'lucide-react';
import type { LucideIcon } from "lucide-react";
import type { Category } from '../interfaces/category.interface';

export const firstCategoryId = '1eb02c49';

interface CategoryGroup extends Category {
  icon: LucideIcon;
}

export const categories: CategoryGroup[] = [
  {
    id: firstCategoryId,
    name: 'Featured',
    slug: 'featured',
    aliases: ['featured', 'feature', 'popular', 'trending'],
    icon: LayoutGrid,
  },
  {
    id: '4fbe4d4d',
    name: 'Pizza',
    slug: 'pizza',
    aliases: ['pizza', 'pizzas'],
    icon: Pizza,
  },
  {
    id: '9deba07b',
    name: 'Burgers',
    slug: 'burgers',
    aliases: [
      'burger',
      'burgers',
      'hamburger',
      'hamburgers',
      'hamburguer',
      'hamburguers',
      'hamburguesa',
      'hamburguesas',
    ],
    icon: Hamburger,
  },
  {
    id: 'a062ff22',
    name: 'Chicken',
    slug: 'chicken',
    aliases: ['chicken', 'chickens', 'pollo', 'wings', 'tenders'],
    icon: Drumstick,
  },
  {
    id: "6b0991d5",
    name: "Pasta",
    slug: 'pasta',
    aliases: ['pasta', 'pastas', 'fideos'],
    icon: Soup,
  },
  {
    id: "657042b9",
    name: "Desserts",
    slug: 'desserts',
    aliases: ['dessert', 'desserts', 'postre', 'postres', 'sweets'],
    icon: CakeSlice,
  },
  {
    id: "b2f49343",
    name: "Salads",
    slug: 'salads',
    aliases: ['salad', 'salads', 'ensalada', 'ensaladas'],
    icon: Salad,
  },
  {
    id: "e44a3d9e",
    name: "Sides",
    slug: 'sides',
    aliases: ['side', 'sides', 'guarnicion', 'guarniciones'],
    icon: UtensilsCrossed,
  },
  {
    id: "m34anx5r",
    name: "Drinks",
    slug: 'drinks',
    aliases: ['drink', 'drinks', 'bebida', 'bebidas', 'soda', 'juice'],
    icon: CupSoda,
  },
];

/**
 * Finds a category by its id or by its slug. Returns `null` when the value is
 * empty or does not match any category.
 */
export const resolveCategory = (value?: string | null): CategoryGroup | null => {
  if (!value) return null;

  const normalized = value.trim().toLowerCase();

  return (
    categories.find(
      (category) =>
        category.id === value ||
        category.id === normalized ||
        category.slug === normalized,
    ) ?? null
  );
};

/** Returns the display name of a category, or an empty string when unknown. */
export const getCategoryName = (categoryId: string): string => {
  return categories.find((category) => category.id === categoryId)?.name ?? '';
};
