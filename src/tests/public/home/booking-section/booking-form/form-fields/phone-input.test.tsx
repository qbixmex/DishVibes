import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { PhoneInput } from '@/app/(public)/(home)/booking-section/booking-form/form-fields/phone-input';
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

describe('Test on <PhoneInput /> component', () => {
  const renderComponent = () => {
    render(<PhoneInput />, { wrapper: TestWrapper });

    return { user: userEvent.setup() };
  };

  test('Should render the phone input', () => {
    renderComponent();

    const input = screen.getByRole('textbox', { name: /phone/i });

    expect(input).toBeVisible();
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show an error when the phone is empty', async () => {
    render(
      <>
        <PhoneInput />
        <TriggerValidation />
      </>,
      { wrapper: TestWrapper },
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Phone is required',
    );
  });

  test('Should show an error when the phone is too short', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('textbox', { name: /phone/i });

    await user.type(input, '123');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Phone must be more than 10 characters length',
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('Should clear the error when the phone is valid', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('textbox', { name: /phone/i });

    await user.type(input, '123');
    await screen.findByRole('alert');

    await user.type(input, '4567890');

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show an error when the phone is too long', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('textbox', { name: /phone/i });

    await user.type(input, '1'.repeat(21));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Phone must be less than 20 characters length',
    );
  });
});
