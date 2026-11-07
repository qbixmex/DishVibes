import type { OrderLine } from '@/shared/interfaces/order.interface';
import {
  selectDiscount,
  selectOrderCount,
  selectOrderTotals,
  selectSubtotal,
} from '@/shared/stores/order-selectors';
import { useOrderStore, type OrderState } from '@/shared/stores/order-store';
import { createOrderLine } from '@/tests/utils/order';

const createState = (
  lines: OrderLine[],
  promoCode: string | null = null,
): OrderState => ({
  ...useOrderStore.getState(),
  lines,
  promoCode,
});

describe('Tests on the order selectors', () => {
  test('Should count the total quantity of the order', () => {
    const state = createState([
      createOrderLine({ lineId: 'line-1', quantity: 2 }),
      createOrderLine({ lineId: 'line-2', quantity: 3 }),
    ]);

    expect(selectOrderCount(state)).toBe(5);
  });

  test('Should return zero for an empty order', () => {
    expect(selectOrderCount(createState([]))).toBe(0);
    expect(selectSubtotal(createState([]))).toBe(0);
  });

  test('Should calculate the subtotal from the line prices', () => {
    const state = createState([
      createOrderLine({ quantity: 2, dish: { price: 10 } }),
      createOrderLine({ lineId: 'line-2', dishId: 'dish-2', quantity: 1, dish: { price: 2.5 } }),
    ]);

    expect(selectSubtotal(state)).toBe(22.5);
  });

  test('Should calculate no discount without a promo code', () => {
    expect(selectDiscount(createState([createOrderLine({ quantity: 2 })]))).toBe(0);
  });

  test('Should calculate the discount of a known promo code', () => {
    expect(
      selectDiscount(createState([createOrderLine({ quantity: 2 })], 'DISH10')),
    ).toBe(2);
  });

  test('Should calculate the tax and total', () => {
    const totals = selectOrderTotals(
      createState([createOrderLine({ quantity: 2, dish: { price: 10 } })]),
    );

    expect(totals).toEqual({
      subtotal: 20,
      discount: 0,
      tax: 1.65,
      total: 21.65,
    });
  });

  test('Should apply the discount before the tax', () => {
    const totals = selectOrderTotals(
      createState([createOrderLine({ quantity: 2, dish: { price: 10 } })], 'DISH10'),
    );

    expect(totals).toEqual({
      subtotal: 20,
      discount: 2,
      tax: 1.49,
      total: 19.49,
    });
  });
});
