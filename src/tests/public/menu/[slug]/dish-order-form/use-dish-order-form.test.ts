import { act, renderHook } from '@testing-library/react';
import { useDishOrderForm } from '@/app/(public)/menu/[slug]/dish-order-form/use-dish-order-form';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { useOrderStore } from '@/shared/stores/order-store';

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

const renderForm = () => renderHook(() => useDishOrderForm(dish));

describe('Tests on useDishOrderForm() hook', () => {
  beforeEach(() => {
    useOrderStore.setState({ lines: [], promoCode: null, hydrated: true });
  });

  test('Should initialize the form with one unit and no instructions', () => {
    const { result } = renderForm();

    expect(result.current.form.getValues()).toEqual({
      quantity: 1,
      specialInstructions: '',
    });
  });

  test('Should use the dish price as the total for one unit', () => {
    const { result } = renderForm();

    expect(result.current.total).toBe(dish.price);
  });

  test('Should recalculate the total when the quantity changes', () => {
    const { result } = renderForm();

    act(() => {
      result.current.form.setValue('quantity', 3);
    });

    expect(result.current.total).toBeCloseTo(dish.price * 3, 2);
  });

  test('Should fall back to the unit price when the quantity is not a number', () => {
    const { result } = renderForm();

    act(() => {
      result.current.form.setValue('quantity', Number.NaN);
    });

    expect(result.current.total).toBe(dish.price);
  });

  test('Should validate the optional special instructions', async () => {
    const { result } = renderForm();

    act(() => {
      result.current.form.setValue('specialInstructions', 'abc');
    });

    await act(async () => {
      await result.current.form.trigger('specialInstructions');
    });

    expect(
      result.current.form.getFieldState('specialInstructions').error?.message,
    ).toBe('Special instructions must be more than 4 characters');
  });

  test('Should accept empty special instructions', async () => {
    const { result } = renderForm();

    act(() => {
      result.current.form.setValue('specialInstructions', '');
    });

    await act(async () => {
      await result.current.form.trigger('specialInstructions');
    });

    expect(
      result.current.form.getFieldState('specialInstructions').error,
    ).toBeUndefined();
  });

  test('Should add the dish to the order when the form is submitted', () => {
    const { result } = renderForm();

    act(() => {
      result.current.onSubmit({
        quantity: 2,
        specialInstructions: 'No onions, please',
      });
    });

    expect(useOrderStore.getState().lines).toEqual([
      expect.objectContaining({
        dishId: dish.id,
        quantity: 2,
        specialInstructions: 'No onions, please',
        dish: expect.objectContaining({ name: dish.name }),
      }),
    ]);
  });
});
