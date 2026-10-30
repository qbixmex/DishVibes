import { create } from 'zustand';

export type DishCategoryStore = {
  categoryId: string | null;
  addCategoryId: (id: string) => void;
  removeCategoryId: () => void;
};

export const useDishCategoryStore = create<DishCategoryStore>((set) => ({
  categoryId: null,
  addCategoryId: (id) => set({ categoryId: id }),
  removeCategoryId: () => set({ categoryId: null }),
}));
