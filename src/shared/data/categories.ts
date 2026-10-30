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
    icon: LayoutGrid,
  },
  {
    id: '4fbe4d4d',
    name: 'Pizza',
    icon: Pizza,
  },
  {
    id: '9deba07b',
    name: 'Burgers',
    icon: Hamburger,
  },
  {
    id: 'a062ff22',
    name: 'Chicken',
    icon: Drumstick,
  },
  {
    id: "6b0991d5",
    name: "Pasta",
    icon: Soup,
  },
  {
    id: "657042b9",
    name: "Desserts",
    icon: CakeSlice,
  },
  {
    id: "b2f49343",
    name: "Salads",
    icon: Salad,
  },
  {
    id: "e44a3d9e",
    name: "Sides",
    icon: UtensilsCrossed,
  },
  {
    id: "m34anx5r",
    name: "Drinks",
    icon: CupSoda,
  },
];
