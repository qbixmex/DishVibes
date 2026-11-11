import {
  normalizeSearchText,
  resolveCategoryFromTerm,
  searchDishes,
} from '@/lib/dish-search';
import { dishes } from '@/shared/data/all-dishes';
import { categories, firstCategoryId } from '@/shared/data/categories';

const categoryById = (categoryId: string) => {
  const category = categories.find((item) => item.id === categoryId);

  if (!category) throw new Error(`Category [${categoryId}] not found`);

  return category;
};

describe('Test on dish search helpers', () => {
  describe('normalizeSearchText()', () => {
    test('Should lowercase, trim and remove accents', () => {
      expect(normalizeSearchText('  Hamburgüesa  ')).toBe('hamburguesa');
    });

    test('Should collapse consecutive spaces', () => {
      expect(normalizeSearchText('Chicago   Style')).toBe('chicago style');
    });
  });

  describe('resolveCategoryFromTerm()', () => {
    test('Should resolve a category by its name', () => {
      expect(resolveCategoryFromTerm('pizza')?.slug).toBe('pizza');
    });

    test('Should resolve a category by one of its aliases', () => {
      expect(resolveCategoryFromTerm('hamburguer')?.slug).toBe('burgers');
      expect(resolveCategoryFromTerm('hamburguesas')?.slug).toBe('burgers');
    });

    test('Should ignore accents and case', () => {
      expect(resolveCategoryFromTerm('ENSALADAS')?.slug).toBe('salads');
    });

    test('Should return null for a term that matches no category', () => {
      expect(resolveCategoryFromTerm('cheese')).toBeNull();
    });

    test('Should ignore single-letter terms', () => {
      expect(resolveCategoryFromTerm('p')).toBeNull();
    });
  });

  describe('searchDishes()', () => {
    test('Should return the featured dishes for an empty term', () => {
      const result = searchDishes('');
      const featured = dishes.filter((dish) => dish.featured);

      expect(result.isPopular).toBe(true);
      expect(result.dishes).toEqual(featured);
      expect(result.category).toBeNull();
      expect(result.seeAllHref).toBeNull();
    });

    test('Should return every dish of a matched category', () => {
      const result = searchDishes('pizza');
      const pizza = categoryById(result.category?.id ?? '');

      expect(result.category?.slug).toBe('pizza');
      expect(result.dishes.length).toBeGreaterThan(0);
      expect(result.dishes.every((dish) => dish.categoryId === pizza.id)).toBe(
        true,
      );
      expect(result.seeAllHref).toBe('/menu?category=pizza');
    });

    test('Should match the dish name when no category is resolved', () => {
      const result = searchDishes('cheese');

      expect(result.category).toBeNull();
      expect(result.dishes.length).toBeGreaterThan(0);
      expect(
        result.dishes.every((dish) =>
          normalizeSearchText(dish.name).includes('cheese'),
        ),
      ).toBe(true);
      expect(result.seeAllHref).toBe('/menu?search=cheese');
    });

    test('Should rank name matches before category-only matches', () => {
      const result = searchDishes('chicken');

      expect(result.dishes.length).toBeGreaterThan(0);
      expect(normalizeSearchText(result.dishes[0].name)).toContain('chicken');
    });

    test('Should ignore accents and case', () => {
      const result = searchDishes('HAMBURGUESA');

      expect(result.category?.slug).toBe('burgers');
      expect(result.dishes.length).toBeGreaterThan(0);
    });

    test('Should encode the term in the text search link', () => {
      const result = searchDishes('chicago style');

      expect(result.category).toBeNull();
      expect(result.seeAllHref).toBe('/menu?search=chicago%20style');
    });

    test('Should return no matches and no link for an unknown term', () => {
      const result = searchDishes('zzzzzz');

      expect(result.dishes).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.seeAllHref).toBeNull();
    });

    test('Should map the featured category to its slug', () => {
      const result = searchDishes('featured');

      expect(result.category?.id).toBe(firstCategoryId);
      expect(result.seeAllHref).toBe('/menu?category=featured');
    });
  });
});
