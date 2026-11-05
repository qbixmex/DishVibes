/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SpecialInstructions } from '@/app/(public)/menu/[slug]/dish-order-form/form-fields/special-instructions';
import {
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

function SetInstructions({ value }: { value: string }) {
  const { setValue } = useFormContext<DishOrderValues>();

  useEffect(() => {
    setValue('specialInstructions', value, { shouldValidate: true });
  }, [setValue, value]);

  return null;
}

describe('Tests on <SpecialInstructions /> component', () => {
  const renderComponent = () => {
    render(<SpecialInstructions />, { wrapper: TestWrapper });

    return {
      user: userEvent.setup(),
      textarea: screen.getByLabelText(/special instructions/i),
    };
  };

  test('Should render an optional textarea', () => {
    const { textarea } = renderComponent();

    expect(textarea).toBeVisible();
    expect(textarea).toHaveValue('');
    expect(textarea).toHaveAttribute('aria-invalid', 'false');
    expect(textarea).toHaveAttribute('maxlength', '250');
    expect(screen.getByText(/we will do our best/i)).toBeVisible();
  });

  test('Should not show an error when the field is empty', () => {
    renderComponent();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show an error when less than four characters are typed', async () => {
    const { user, textarea } = renderComponent();

    await user.type(textarea, 'abc');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Special instructions must be more than 4 characters',
    );
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  test('Should not show an error when four characters are typed', async () => {
    const { user, textarea } = renderComponent();

    await user.type(textarea, 'abcd');

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(textarea).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should clear the error when the textarea is emptied again', async () => {
    const { user, textarea } = renderComponent();

    await user.type(textarea, 'abc');
    await screen.findByRole('alert');

    await user.clear(textarea);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(textarea).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should accept a whitespace only value as empty', async () => {
    const { user, textarea } = renderComponent();

    await user.type(textarea, '    ');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show an error when the value is longer than 250 characters', async () => {
    render(
      <>
        <SetInstructions value={'a'.repeat(251)} />
        <SpecialInstructions />
      </>,
      { wrapper: TestWrapper },
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Special instructions must be less than 250 characters',
    );
  });
});
