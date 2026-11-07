import { MAX_QUANTITY, MIN_QUANTITY } from '@/shared/constants/order';
import type { Dish } from '@/shared/interfaces/dish.interface';
import {
  toOrderDishSnapshot,
  useOrderStore,
  type AddOrderLineInput,
} from '@/shared/stores/order-store';
import { resetOrderStore } from '@/tests/utils/order';

const dish: Dish = {
  id: 'd2f9d32f-fa53-4848-a8dc-675fce14641a',
  name: 'Pepperoni Pizza',
  slug: 'pepperoni-pizza',
  imageUrl: '/images/pizzas/pepperoni-pizza.png',
  description: 'Pepperoni slices, mozzarella cheese and tomato sauce.',
  price: 12.95,
  featured: true,
  categoryId: '4fbe4d4d',
};

const lineInput = (
  overrides: Partial<AddOrderLineInput> = {},
): AddOrderLineInput => ({
  dishId: dish.id,
  quantity: 1,
  specialInstructions: '',
  dish: toOrderDishSnapshot(dish),
  ...overrides,
});

describe('Tests on the order store', () => {
  beforeEach(() => {
    resetOrderStore();
  });

  test('Should start with an empty order', () => {
    expect(useOrderStore.getState().lines).toEqual([]);
    expect(useOrderStore.getState().promoCode).toBeNull();
  });

  test('Should add a new line with a generated id', () => {
    useOrderStore.getState().addLine(lineInput({ quantity: 2 }));

    const [line] = useOrderStore.getState().lines;

    expect(useOrderStore.getState().lines).toHaveLength(1);
    expect(line.lineId).toBeTruthy();
    expect(line).toMatchObject({
      dishId: dish.id,
      quantity: 2,
      specialInstructions: '',
      dish: expect.objectContaining({ name: dish.name, price: dish.price }),
    });
  });

  test('Should merge the quantity of the same dish and instructions', () => {
    useOrderStore.getState().addLine(lineInput({ quantity: 2 }));
    useOrderStore.getState().addLine(lineInput({ quantity: 3 }));

    expect(useOrderStore.getState().lines).toHaveLength(1);
    expect(useOrderStore.getState().lines[0].quantity).toBe(5);
  });

  test('Should keep separate lines for different instructions', () => {
    useOrderStore.getState().addLine(lineInput({ specialInstructions: 'No onions' }));
    useOrderStore.getState().addLine(lineInput({ specialInstructions: 'Extra cheese' }));

    expect(useOrderStore.getState().lines).toHaveLength(2);
  });

  test('Should trim the special instructions', () => {
    useOrderStore.getState().addLine(lineInput({ specialInstructions: '  No onions  ' }));

    expect(useOrderStore.getState().lines[0].specialInstructions).toBe('No onions');
  });

  test('Should clamp the quantity to the allowed range', () => {
    useOrderStore.getState().addLine(lineInput({ quantity: 0 }));

    expect(useOrderStore.getState().lines[0].quantity).toBe(MIN_QUANTITY);

    useOrderStore.getState().addLine(lineInput({ quantity: 99 }));

    expect(useOrderStore.getState().lines[0].quantity).toBe(MAX_QUANTITY);
  });

  test('Should update a line quantity and clamp it', () => {
    useOrderStore.getState().addLine(lineInput({ quantity: 2 }));

    const { lineId } = useOrderStore.getState().lines[0];

    useOrderStore.getState().setLineQuantity(lineId, 4);
    expect(useOrderStore.getState().lines[0].quantity).toBe(4);

    useOrderStore.getState().setLineQuantity(lineId, 0);
    expect(useOrderStore.getState().lines[0].quantity).toBe(MIN_QUANTITY);
  });

  test('Should increment and decrement a line quantity', () => {
    useOrderStore.getState().addLine(lineInput({ quantity: 2 }));

    const { lineId } = useOrderStore.getState().lines[0];

    useOrderStore.getState().incrementLine(lineId);
    expect(useOrderStore.getState().lines[0].quantity).toBe(3);

    useOrderStore.getState().decrementLine(lineId);
    expect(useOrderStore.getState().lines[0].quantity).toBe(2);
  });

  test('Should not decrement below the minimum quantity', () => {
    useOrderStore.getState().addLine(lineInput({ quantity: 1 }));

    const { lineId } = useOrderStore.getState().lines[0];

    useOrderStore.getState().decrementLine(lineId);

    expect(useOrderStore.getState().lines[0].quantity).toBe(MIN_QUANTITY);
  });

  test('Should remove a line', () => {
    useOrderStore.getState().addLine(lineInput());

    const { lineId } = useOrderStore.getState().lines[0];

    useOrderStore.getState().removeLine(lineId);

    expect(useOrderStore.getState().lines).toEqual([]);
  });

  test('Should apply a known promo code', () => {
    const applied = useOrderStore.getState().applyPromo(' dish10 ');

    expect(applied).toBe(true);
    expect(useOrderStore.getState().promoCode).toBe('DISH10');
  });

  test('Should reject an unknown promo code', () => {
    const applied = useOrderStore.getState().applyPromo('NOPE');

    expect(applied).toBe(false);
    expect(useOrderStore.getState().promoCode).toBeNull();
  });

  test('Should remove the applied promo code', () => {
    useOrderStore.getState().applyPromo('DISH10');
    useOrderStore.getState().removePromo();

    expect(useOrderStore.getState().promoCode).toBeNull();
  });

  test('Should clear the lines and the promo code', () => {
    useOrderStore.getState().addLine(lineInput());
    useOrderStore.getState().applyPromo('DISH10');

    useOrderStore.getState().clearOrder();

    expect(useOrderStore.getState().lines).toEqual([]);
    expect(useOrderStore.getState().promoCode).toBeNull();
  });

  test('Should track hydration', () => {
    expect(useOrderStore.getState().hydrated).toBe(true);

    useOrderStore.getState().setHydrated(false);

    expect(useOrderStore.getState().hydrated).toBe(false);
  });
});
