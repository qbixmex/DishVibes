import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { NameInput } from '@/app/(public)/(home)/booking-section/booking-form/form-fields/name-input';
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

describe('Test on <NameInput /> component', () => {
  const renderComponent = () => {
    render(<NameInput />, { wrapper: TestWrapper });

    return { user: userEvent.setup() };
  };

  test('Should render the name input', () => {
    renderComponent();

    const input = screen.getByRole('textbox', { name: /name/i });

    expect(input).toBeVisible();
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show an error when the name is empty', async () => {
    render(
      <>
        <NameInput />
        <TriggerValidation />
      </>,
      { wrapper: TestWrapper },
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Name is required',
    );
  });

  test('Should show an error when the name is too short', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('textbox', { name: /name/i });

    await user.type(input, 'ab');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Name is must be 3 characters length',
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('Should clear the error when the name is valid', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('textbox', { name: /name/i });

    await user.type(input, 'ab');
    await screen.findByRole('alert');

    await user.type(input, 'c');

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show an error when the name is too long', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('textbox', { name: /name/i });

    await user.type(input, 'a'.repeat(101));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Name must be less than 100 characters',
    );
  });
});
