import {
  getDishBySlug,
  getDishSlugs,
} from '@/app/(public)/menu/[slug]/(actions)/get-dish-by-slug';
import { dishes } from '@/shared/data/all-dishes';

describe('Tests on getDishBySlug() action', () => {
  const dish = dishes[0];

  test('Should return the dish that matches the slug', async () => {
    const result = await getDishBySlug(dish.slug);

    expect(result).toEqual({
      success: true,
      dish,
      error: null,
    });
  });

  test('Should fail with an error message when the slug does not exist', async () => {
    const result = await getDishBySlug('not-a-dish');

    expect(result).toEqual({
      success: false,
      dish: null,
      error: 'Dish with slug [not-a-dish] not found',
    });
  });

  test('Should be case sensitive when matching the slug', async () => {
    const result = await getDishBySlug(dish.slug.toUpperCase());

    expect(result.success).toBe(false);
    expect(result.dish).toBeNull();
  });
});

describe('Tests on getDishSlugs() action', () => {
  test('Should return the slug of every dish', async () => {
    const slugs = await getDishSlugs();

    expect(slugs).toEqual(dishes.map((dish) => dish.slug));
  });

  test('Should not return duplicated slugs', async () => {
    const slugs = await getDishSlugs();

    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
