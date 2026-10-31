import {
  getHomeDishes,
  resetHomeDishesCache,
} from '@/app/(public)/(home)/actions/get-home-dishes';
import { dishes } from '@/shared/data/all-dishes';

const someCategoryId = dishes[0].categoryId;

describe('Test on getHomeDishes() action', () => {
  beforeEach(() => {
    resetHomeDishesCache();
  });

  test('Should return only featured dishes when categoryId is null', async () => {
    const result = await getHomeDishes({ categoryId: null, limit: 4 });

    expect(result).toHaveLength(4);
    expect(result.every((dish) => dish.featured)).toBe(true);
  });

  test('Should respect the requested limit', async () => {
    const result = await getHomeDishes({ categoryId: null, limit: 2 });

    expect(result).toHaveLength(2);
  });

  test('Should return only the dishes of the given category', async () => {
    const expectedDishes = dishes.filter(
      (dish) => dish.categoryId === someCategoryId,
    );

    const result = await getHomeDishes({
      categoryId: someCategoryId,
      limit: 100,
    });

    expect(result).toHaveLength(expectedDishes.length);
    expect(result.every((dish) => dish.categoryId === someCategoryId)).toBe(
      true,
    );
  });

  test('Should return an empty list when the category has no dishes', async () => {
    const result = await getHomeDishes({
      categoryId: 'unknown-category',
      limit: 4,
    });

    expect(result).toEqual([]);
  });

  test('Should reuse the same promise for the same arguments', () => {
    const firstRequest = getHomeDishes({ categoryId: null, limit: 4 });
    const secondRequest = getHomeDishes({ categoryId: null, limit: 4 });

    expect(secondRequest).toBe(firstRequest);
  });

  test('Should create a new promise for different arguments', () => {
    const featuredRequest = getHomeDishes({ categoryId: null, limit: 4 });
    const categoryRequest = getHomeDishes({
      categoryId: someCategoryId,
      limit: 4,
    });

    expect(categoryRequest).not.toBe(featuredRequest);
  });
});
