/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DishQuantity } from '@/app/(public)/menu/[slug]/dish-order-form/form-fields/dish-quantity';
import {
  MAX_QUANTITY,
  dishOrderSchema,
  type DishOrderValues,
} from '@/app/(public)/menu/[slug]/dish-order-form/dish-order-schema';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<DishOrderValues>({
    resolver: zodResolver(dishOrderSchema) as any,
    mode: 'onChange',
    defaultValues: {
      quantity: 1,
      specialInstructions: '',
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function SetQuantity({ value }: { value: number }) {
  const { setValue } = useFormContext<DishOrderValues>();

  useEffect(() => {
    setValue('quantity', value, { shouldValidate: true });
  }, [setValue, value]);

  return null;
}

describe('Tests on <DishQuantity /> component', () => {
  const renderComponent = () => {
    render(<DishQuantity />, { wrapper: TestWrapper });

    return {
      user: userEvent.setup(),
      input: screen.getByRole('spinbutton', { name: /quantity/i }),
      decrease: screen.getByRole('button', { name: /decrease quantity/i }),
      increase: screen.getByRole('button', { name: /increase quantity/i }),
    };
  };

  test('Should render the quantity with its label and stepper buttons', () => {
    const { input, decrease, increase } = renderComponent();

    expect(input).toBeVisible();
    expect(input).toHaveValue(1);
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(decrease).toBeVisible();
    expect(increase).toBeVisible();
  });

  test('Should disable the decrease button on the minimum quantity', () => {
    const { decrease, increase } = renderComponent();

    expect(decrease).toBeDisabled();
    expect(increase).toBeEnabled();
  });

  test('Should increase the quantity when the plus button is clicked', async () => {
    const { user, input, decrease, increase } = renderComponent();

    await user.click(increase);

    expect(input).toHaveValue(2);
    expect(decrease).toBeEnabled();
  });

  test('Should decrease the quantity when the minus button is clicked', async () => {
    const { user, input } = renderComponent();

    await user.click(screen.getByRole('button', { name: /increase quantity/i }));
    await user.click(screen.getByRole('button', { name: /decrease quantity/i }));

    expect(input).toHaveValue(1);
  });

  test('Should stop increasing when the maximum quantity is reached', async () => {
    const user = userEvent.setup();

    render(
      <>
        <SetQuantity value={MAX_QUANTITY - 1} />
        <DishQuantity />
      </>,
      { wrapper: TestWrapper },
    );

    const input = screen.getByRole('spinbutton', { name: /quantity/i });
    const increase = screen.getByRole('button', { name: /increase quantity/i });

    await user.click(increase);

    expect(input).toHaveValue(MAX_QUANTITY);
    expect(increase).toBeDisabled();
  });

  test('Should update the quantity when the input changes', () => {
    const { input } = renderComponent();

    fireEvent.change(input, { target: { value: '5' } });

    expect(input).toHaveValue(5);
  });

  test('Should clamp the quantity between the allowed limits', () => {
    const { input } = renderComponent();

    fireEvent.change(input, { target: { value: '99' } });
    expect(input).toHaveValue(MAX_QUANTITY);

    fireEvent.change(input, { target: { value: '0' } });
    expect(input).toHaveValue(1);
  });

  test('Should reset to one when the input is emptied', () => {
    const { input } = renderComponent();

    fireEvent.change(input, { target: { value: '' } });

    expect(input).toHaveValue(1);
  });

  test('Should show the validation error for an invalid quantity', async () => {
    render(
      <>
        <SetQuantity value={0} />
        <DishQuantity />
      </>,
      { wrapper: TestWrapper },
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Minimum quantity is 1',
    );
  });
});
