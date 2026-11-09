import { getOrderSuggestions } from '@/app/(public)/orders/(actions)/get-orders-suggestions';
import { drinks } from '@/shared/data/drinks';

vi.mock('@/lib/utils', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('@/lib/utils');

  return { ...actual, sleep: vi.fn().mockResolvedValue(undefined) };
});

const expectedSuggestions = drinks.slice(0, 3).map((drink) => ({
  id: drink.id,
  name: drink.name,
  slug: drink.slug,
  imageUrl: drink.imageUrl,
  description: drink.description,
  price: drink.price,
}));

describe('Test on getOrderSuggestions() action', () => {
  test('Should return the first three drinks as suggestions', async () => {
    const result = await getOrderSuggestions();

    expect(result.success).toBe(true);
    expect(result.errors).toBeNull();
    expect(result.suggestions).toEqual(expectedSuggestions);
  });

  test('Should not repeat a drink within the suggestions', async () => {
    const result = await getOrderSuggestions();
    const ids = result.suggestions.map((suggestion) => suggestion.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  test('Should only expose the dish fields needed to render a suggestion', async () => {
    const result = await getOrderSuggestions();

    expect(result.suggestions[0]).toEqual({
      id: drinks[0].id,
      name: drinks[0].name,
      slug: drinks[0].slug,
      imageUrl: drinks[0].imageUrl,
      description: drinks[0].description,
      price: drinks[0].price,
    });
  });
});
