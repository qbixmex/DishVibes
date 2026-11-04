/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { PeopleInput } from '@/app/(public)/(home)/booking-section/booking-form/form-fields/people-input';
import { bookingSchema } from '@/app/(public)/(home)/booking-section/booking-form/booking-schema';

type BookingValues = z.infer<typeof bookingSchema>;

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema) as any,
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      people: 0,
      bookingDate: new Date(2026, 0, 15),
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function TriggerValidation() {
  const { trigger } = useFormContext();

  useEffect(() => {
    trigger();
  }, [trigger]);

  return null;
}

describe('Test on <PeopleInput /> component', () => {
  const renderComponent = () => {
    render(<PeopleInput />, { wrapper: TestWrapper });

    return { user: userEvent.setup() };
  };

  test('Should render the people input with the default value', () => {
    renderComponent();

    const input = screen.getByRole('spinbutton', {
      name: /number of persons/i,
    });

    expect(input).toBeVisible();
    expect(input).toHaveValue(0);
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should store the typed value as a number', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('spinbutton', {
      name: /number of persons/i,
    });

    await user.clear(input);
    await user.type(input, '3');

    expect(input).toHaveValue(3);
  });

  test('Should show an error when the number of people is zero', async () => {
    render(
      <>
        <PeopleInput />
        <TriggerValidation />
      </>,
      { wrapper: TestWrapper },
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'People must be greater than 0',
    );
  });

  test('Should show an error when the value is not a number', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('spinbutton', {
      name: /number of persons/i,
    });

    await user.clear(input);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'People must be a valid number',
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('Should clear the error when the number of people is valid', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('spinbutton', {
      name: /number of persons/i,
    });

    await user.clear(input);
    await user.type(input, '4');

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });
});
