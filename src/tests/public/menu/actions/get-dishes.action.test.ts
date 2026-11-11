import { getDishesAction } from '@/app/(public)/menu/(actions)/get-dishes.action';
import { searchDishes } from '@/lib/dish-search';
import { dishes } from '@/shared/data/all-dishes';
import { categories, firstCategoryId } from '@/shared/data/categories';

const categoryId = dishes[0].categoryId;
const pizzaCategory = categories.find((category) => category.name === 'Pizza');
const categoryDishes = dishes.filter((dish) => dish.categoryId === categoryId);
const orderedCategoryDishes = [
  ...categoryDishes.filter((dish) => dish.featured),
  ...categoryDishes.filter((dish) => !dish.featured),
];
const featuredDishes = dishes.filter((dish) => dish.featured);

describe('Test on getDishesAction() action', () => {
  test('Should paginate all dishes and report the correct total pages', async () => {
    const result = await getDishesAction({ page: 1, take: 4 });

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(result.dishes).toHaveLength(4);
    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: Math.ceil(dishes.length / 4),
    });
  });

  test('Should return featured dishes first when there is no category', async () => {
    const result = await getDishesAction({ page: 1, take: 4 });

    expect(result.dishes.every((dish) => dish.featured)).toBe(true);
  });

  test('Should return only non-featured dishes after the featured ones', async () => {
    const result = await getDishesAction({ page: 3, take: 4 });

    expect(result.dishes.some((dish) => dish.featured)).toBe(false);
  });

  test('Should keep the original order but move featured dishes first when filtering by category', async () => {
    const result = await getDishesAction({
      category: categoryId,
      page: 1,
      take: 3,
    });

    expect(result.dishes).toEqual(orderedCategoryDishes.slice(0, 3));
    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: Math.ceil(orderedCategoryDishes.length / 3),
    });
  });

  test('Should paginate category results', async () => {
    const result = await getDishesAction({
      category: categoryId,
      page: 2,
      take: 3,
    });

    expect(result.dishes).toEqual(orderedCategoryDishes.slice(3, 6));
    expect(result.pagination).toEqual({
      currentPage: 2,
      totalPages: Math.ceil(orderedCategoryDishes.length / 3),
    });
  });

  test('Should return only featured dishes when the featured category is selected', async () => {
    const result = await getDishesAction({
      category: firstCategoryId,
      page: 1,
      take: 4,
    });

    expect(result.success).toBe(true);
    expect(result.dishes).toEqual(featuredDishes.slice(0, 4));
    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: Math.ceil(featuredDishes.length / 4),
    });
  });

  test('Should paginate featured dishes', async () => {
    const result = await getDishesAction({
      category: firstCategoryId,
      page: 2,
      take: 4,
    });

    expect(result.dishes).toEqual(featuredDishes.slice(4, 8));
    expect(result.pagination).toEqual({
      currentPage: 2,
      totalPages: Math.ceil(featuredDishes.length / 4),
    });
  });

  test('Should return an error when the category has no dishes', async () => {
    const result = await getDishesAction({
      category: 'unknown-category',
      page: 1,
      take: 4,
    });

    expect(result).toEqual({
      success: false,
      error: 'There is no dishes with selected category',
      dishes: [],
      pagination: null,
    });
  });

  test('Should resolve the category from its slug', async () => {
    if (!pizzaCategory) throw new Error('Pizza category not found');

    const pizzaDishes = dishes.filter(
      (dish) => dish.categoryId === pizzaCategory.id,
    );
    const orderedPizzaDishes = [
      ...pizzaDishes.filter((dish) => dish.featured),
      ...pizzaDishes.filter((dish) => !dish.featured),
    ];

    const result = await getDishesAction({
      category: pizzaCategory.slug,
      page: 1,
      take: 3,
    });

    expect(result.dishes).toEqual(orderedPizzaDishes.slice(0, 3));
    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: Math.ceil(orderedPizzaDishes.length / 3),
    });
  });

  test('Should resolve the featured category from its slug', async () => {
    const result = await getDishesAction({
      category: 'featured',
      page: 1,
      take: 4,
    });

    expect(result.dishes).toEqual(featuredDishes.slice(0, 4));
  });

  test('Should filter the dishes by a search term', async () => {
    if (!pizzaCategory) throw new Error('Pizza category not found');

    const result = await getDishesAction({
      search: 'pizza',
      page: 1,
      take: 100,
    });

    expect(result.success).toBe(true);
    expect(result.dishes).toHaveLength(
      dishes.filter((dish) => dish.categoryId === pizzaCategory.id).length,
    );
    expect(
      result.dishes.every((dish) => dish.categoryId === pizzaCategory.id),
    ).toBe(true);
  });

  test('Should keep the relevance order of the search results', async () => {
    const result = await getDishesAction({
      search: 'chicken',
      page: 1,
      take: 4,
    });

    expect(result.dishes).toEqual(searchDishes('chicken').dishes.slice(0, 4));
  });

  test('Should combine the search term with the category filter', async () => {
    if (!pizzaCategory) throw new Error('Pizza category not found');

    const expected = searchDishes('cheese').dishes.filter(
      (dish) => dish.categoryId === pizzaCategory.id,
    );
    const result = await getDishesAction({
      search: 'cheese',
      category: pizzaCategory.slug,
      page: 1,
      take: 100,
    });

    expect(result.dishes).toEqual(expected);
  });

  test('Should return an error when the search term has no matches', async () => {
    const result = await getDishesAction({ search: 'zzzzzz' });

    expect(result).toEqual({
      success: false,
      error: 'There is no dishes matching your search',
      dishes: [],
      pagination: null,
    });
  });

  test('Should sanitize invalid page and take values', async () => {
    const result = await getDishesAction({
      page: Number.NaN,
      take: 0,
    });

    expect(result.pagination?.currentPage).toBe(1);
    expect(result.dishes).toHaveLength(4);
  });

  test('Should clamp a page greater than the last page', async () => {
    const totalPages = Math.ceil(dishes.length / 4);
    const result = await getDishesAction({ page: 999, take: 4 });

    expect(result.pagination).toEqual({
      currentPage: totalPages,
      totalPages,
    });
  });

  test('Should default the page and the page size', async () => {
    const result = await getDishesAction({});

    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: Math.ceil(dishes.length / 4),
    });
    expect(result.dishes).toHaveLength(4);
  });

  test('Should treat a null category as no category', async () => {
    const result = await getDishesAction({ category: null, page: 1, take: 4 });

    expect(result.success).toBe(true);
    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: Math.ceil(dishes.length / 4),
    });
  });

  test('Should sanitize negative page and take values', async () => {
    const result = await getDishesAction({ page: -3, take: -1 });

    expect(result.pagination?.currentPage).toBe(1);
    expect(result.dishes).toHaveLength(4);
  });

  test('Should clamp a page greater than the last page of a category', async () => {
    const result = await getDishesAction({
      category: categoryId,
      page: 999,
      take: 1,
    });

    expect(result.pagination).toEqual({
      currentPage: orderedCategoryDishes.length,
      totalPages: orderedCategoryDishes.length,
    });
    expect(result.dishes).toEqual(
      orderedCategoryDishes.slice(orderedCategoryDishes.length - 1),
    );
  });

  test('Should not repeat dishes within a randomized page', async () => {
    const result = await getDishesAction({ page: 1, take: 4 });
    const ids = result.dishes.map((dish) => dish.id);
    const allIds = new Set(dishes.map((dish) => dish.id));

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => allIds.has(id))).toBe(true);
  });

  test('Should return every category dish exactly once when paginating all pages', async () => {
    const totalPages = Math.ceil(orderedCategoryDishes.length / 4);
    const results = await Promise.all(
      Array.from({ length: totalPages }, (_, index) =>
        getDishesAction({ category: categoryId, page: index + 1, take: 4 }),
      ),
    );
    const paginatedDishes = results.flatMap((result) => result.dishes);

    expect(paginatedDishes).toEqual(orderedCategoryDishes);
  });

  test('Should keep featured dishes before the regular ones on every page', async () => {
    const totalPages = Math.ceil(dishes.length / 4);
    const results = await Promise.all(
      Array.from({ length: totalPages }, (_, index) =>
        getDishesAction({ page: index + 1, take: 4 }),
      ),
    );
    const paginatedDishes = results.flatMap((result) => result.dishes);
    const firstRegularIndex = paginatedDishes.findIndex(
      (dish) => !dish.featured,
    );

    expect(firstRegularIndex).toBeGreaterThan(-1);
    expect(
      paginatedDishes.slice(0, firstRegularIndex).every((dish) => dish.featured),
    ).toBe(true);
    expect(
      paginatedDishes.slice(firstRegularIndex).some((dish) => dish.featured),
    ).toBe(false);
  });
});
