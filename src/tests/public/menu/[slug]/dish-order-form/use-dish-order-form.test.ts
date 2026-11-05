import { act, renderHook } from '@testing-library/react';
import { useDishOrderForm } from '@/app/(public)/menu/[slug]/dish-order-form/use-dish-order-form';

const price = 12.95;

describe('Tests on useDishOrderForm() hook', () => {
  test('Should initialize the form with one unit and no instructions', () => {
    const { result } = renderHook(() => useDishOrderForm(price));

    expect(result.current.form.getValues()).toEqual({
      quantity: 1,
      specialInstructions: '',
    });
  });

  test('Should use the dish price as the total for one unit', () => {
    const { result } = renderHook(() => useDishOrderForm(price));

    expect(result.current.total).toBe(price);
  });

  test('Should recalculate the total when the quantity changes', () => {
    const { result } = renderHook(() => useDishOrderForm(price));

    act(() => {
      result.current.form.setValue('quantity', 3);
    });

    expect(result.current.total).toBeCloseTo(price * 3, 2);
  });

  test('Should fall back to the unit price when the quantity is not a number', () => {
    const { result } = renderHook(() => useDishOrderForm(price));

    act(() => {
      result.current.form.setValue('quantity', Number.NaN);
    });

    expect(result.current.total).toBe(price);
  });

  test('Should validate the optional special instructions', async () => {
    const { result } = renderHook(() => useDishOrderForm(price));

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
    const { result } = renderHook(() => useDishOrderForm(price));

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

  test('Should not throw when the order is submitted because it is not implemented yet', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const { result } = renderHook(() => useDishOrderForm(price));

    expect(() =>
      result.current.onSubmit({ quantity: 1, specialInstructions: '' }),
    ).not.toThrow();

    vi.restoreAllMocks();
  });
});
