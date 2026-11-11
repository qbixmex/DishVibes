import { dishes } from '@/shared/data/all-dishes';
import { categories, firstCategoryId } from '@/shared/data/categories';
import type { Category } from '@/shared/interfaces/category.interface';
import type { Dish } from '@/shared/interfaces/dish.interface';

/**
 * Maximum amount of dishes the search panel lists. The panel is scrollable,
 * so the rest of the matches stay reachable without growing the panel.
 */
export const SEARCH_RESULT_LIMIT = 8;

const DIACRITICS = /[\u0300-\u036f]/g;

/**
 * Prepares text for comparison: removes accents, lowercases it and collapses
 * the whitespace so "  Hamburgüesa " matches "hamburguesa".
 */
export const normalizeSearchText = (value: string): string => {
  return value
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
};

const categoryMatches = (category: Category, term: string): boolean => {
  const candidates = [category.name, category.slug, ...category.aliases];

  return candidates.some((candidate) => {
    const normalizedCandidate = normalizeSearchText(candidate);

    return (
      normalizedCandidate.startsWith(term) || term.startsWith(normalizedCandidate)
    );
  });
};

/**
 * Finds the category a term refers to, either by its name or one of its
 * aliases ("hamburguers" resolves to Burgers). Returns `null` when the term
 * does not point at a single category.
 */
export const resolveCategoryFromTerm = (term: string): Category | null => {
  const normalizedTerm = normalizeSearchText(term);

  // One-letter terms are too fuzzy for category resolution.
  if (normalizedTerm.length < 2) return null;

  let bestMatch: { category: Category; length: number } | null = null;

  for (const category of categories) {
    if (!categoryMatches(category, normalizedTerm)) continue;

    const longestCandidate = [category.name, category.slug, ...category.aliases]
      .map(normalizeSearchText)
      .filter(
        (candidate) =>
          candidate.startsWith(normalizedTerm) ||
          normalizedTerm.startsWith(candidate),
      )
      .reduce((longest, candidate) =>
        candidate.length > longest.length ? candidate : longest,
      );

    if (!bestMatch || longestCandidate.length > bestMatch.length) {
      bestMatch = { category, length: longestCandidate.length };
    }
  }

  return bestMatch?.category ?? null;
};

const scoreDish = (
  dish: Dish,
  term: string,
  category: Category | null,
): number | null => {
  const name = normalizeSearchText(dish.name);

  if (name.startsWith(term)) return 0;
  if (name.includes(term)) return 1;
  if (!category) return null;

  // "featured" is a pseudo-category: its dishes are the featured ones.
  if (category.id === firstCategoryId) return dish.featured ? 2 : null;

  return dish.categoryId === category.id ? 2 : null;
};

const buildSeeAllHref = (
  term: string,
  category: Category | null,
  total: number,
): string | null => {
  if (total === 0) return null;
  if (category) return `/menu?category=${category.slug}`;

  return `/menu?search=${encodeURIComponent(term)}`;
};

export type DishSearchResults = Readonly<{
  term: string;
  category: Category | null;
  dishes: Dish[];
  total: number;
  seeAllHref: string | null;
  isPopular: boolean;
}>;

/**
 * Searches the static dish catalog by dish name and category name.
 * An empty term returns the featured dishes shown under "Popular right now".
 */
export const searchDishes = (term?: string | null): DishSearchResults => {
  const rawTerm = term?.trim() ?? '';
  const normalizedTerm = normalizeSearchText(rawTerm);

  if (!normalizedTerm) {
    const featuredDishes = dishes.filter((dish) => dish.featured);

    return {
      term: '',
      category: null,
      dishes: featuredDishes,
      total: featuredDishes.length,
      seeAllHref: null,
      isPopular: true,
    };
  }

  const category = resolveCategoryFromTerm(normalizedTerm);

  const matches = dishes
    .map((dish, index) => ({
      dish,
      index,
      score: scoreDish(dish, normalizedTerm, category),
    }))
    .filter(
      (entry): entry is { dish: Dish; index: number; score: number } =>
        entry.score !== null,
    )
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map((entry) => entry.dish);

  return {
    term: rawTerm,
    category,
    dishes: matches,
    total: matches.length,
    seeAllHref: buildSeeAllHref(rawTerm, category, matches.length),
    isPopular: false,
  };
};
