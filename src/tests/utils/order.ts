import type { OrderLine } from '@/shared/interfaces/order.interface';
import { useOrderStore } from '@/shared/stores/order-store';

type OrderLineOverrides = Partial<Omit<OrderLine, 'dish'>> & {
  dish?: Partial<OrderLine['dish']>;
};

export const createOrderLine = (
  overrides: OrderLineOverrides = {},
): OrderLine => ({
  lineId: overrides.lineId ?? 'line-1',
  dishId: overrides.dishId ?? 'dish-1',
  quantity: overrides.quantity ?? 2,
  specialInstructions: overrides.specialInstructions ?? '',
  dish: {
    id: 'dish-1',
    name: 'Pepperoni Pizza',
    slug: 'pepperoni-pizza',
    imageUrl: '/images/pizzas/pepperoni-pizza.png',
    description: 'Pepperoni slices, mozzarella cheese and tomato sauce.',
    price: 10,
    ...overrides.dish,
  },
});

export const resetOrderStore = (): void => {
  localStorage.clear();
  useOrderStore.setState({
    lines: [],
    promoCode: null,
    hydrated: true,
  });
};
