import type { Dish } from '@/shared/interfaces/dish.interface';
import {
  getHomeDishes,
  resetHomeDishesCache,
} from '@/app/(public)/(home)/actions/get-home-dishes';
import {
  createDbDishes,
  createExtraDish,
  dessertsCategoryId,
  hamburgersCategoryId,
  pizzasCategoryId,
} from './dishes.fixture';

const { mockDbDishes } = vi.hoisted(() => ({ mockDbDishes: [] as Dish[] }));

vi.mock('@/shared/data/all-dishes', () => ({ dishes: mockDbDishes }));

const featuredDishes = createDbDishes().filter((dish) => dish.featured);

const dishesOf = (categoryId: string) =>
  createDbDishes().filter((dish) => dish.categoryId === categoryId);

describe('Test on getHomeDishes() action', () => {
  beforeEach(() => {
    resetHomeDishesCache();
    mockDbDishes.splice(0, mockDbDishes.length, ...createDbDishes());
  });

  test('Should return only featured dishes when categoryId is null', async () => {
    const result = await getHomeDishes({ categoryId: null, limit: 4 });

    expect(result).toEqual(featuredDishes.slice(0, 4));
    expect(result.every((dish) => dish.featured)).toBe(true);
  });

  test('Should respect the requested limit', async () => {
    const result = await getHomeDishes({ categoryId: null, limit: 2 });

    expect(result).toEqual(featuredDishes.slice(0, 2));
    expect(result).toHaveLength(2);
  });

  test('Should return only the dishes of the given category', async () => {
    const expectedDishes = dishesOf(pizzasCategoryId);

    const result = await getHomeDishes({
      categoryId: pizzasCategoryId,
      limit: 100,
    });

    expect(result).toEqual(expectedDishes);
    expect(result.every((dish) => dish.categoryId === pizzasCategoryId)).toBe(
      true,
    );
  });

  test('Should return an empty list when the category has no dishes', async () => {
    const result = await getHomeDishes({
      categoryId: dessertsCategoryId,
      limit: 4,
    });

    expect(result).toEqual([]);
  });

  test('Should include records written to the data source after the seed', async () => {
    const extraDish = createExtraDish();

    mockDbDishes.push(extraDish);
    resetHomeDishesCache();

    const result = await getHomeDishes({
      categoryId: pizzasCategoryId,
      limit: 100,
    });

    expect(result).toContainEqual(extraDish);
  });

  test('Should not read the data source again while the request is cached', async () => {
    const firstRequest = getHomeDishes({ categoryId: null, limit: 4 });

    mockDbDishes.length = 0;

    const secondRequest = getHomeDishes({ categoryId: null, limit: 4 });

    expect(secondRequest).toBe(firstRequest);
    expect(await secondRequest).toEqual(featuredDishes.slice(0, 4));
  });

  test('Should reuse the same promise for the same arguments', () => {
    const firstRequest = getHomeDishes({ categoryId: null, limit: 4 });
    const secondRequest = getHomeDishes({ categoryId: null, limit: 4 });

    expect(secondRequest).toBe(firstRequest);
  });

  test('Should create a new promise for different arguments', () => {
    const featuredRequest = getHomeDishes({ categoryId: null, limit: 4 });
    const categoryRequest = getHomeDishes({
      categoryId: hamburgersCategoryId,
      limit: 4,
    });

    expect(categoryRequest).not.toBe(featuredRequest);
  });
});
