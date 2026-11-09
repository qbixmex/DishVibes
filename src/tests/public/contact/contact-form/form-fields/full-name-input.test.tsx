/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FullNameInput } from '@/app/(public)/contact/(components)/contact-form/form-fields/full-name-input';
import {
  contactSchema,
  type ContactValues,
} from '@/app/(public)/contact/(components)/contact-form/contact-schema';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema) as any,
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      message: '',
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

describe('Test on <FullNameInput /> component', () => {
  const renderComponent = () => {
    render(<FullNameInput />, { wrapper: TestWrapper });

    return { user: userEvent.setup() };
  };

  test('Should render the full name input', () => {
    renderComponent();

    const input = screen.getByRole('textbox', { name: /full name/i });

    expect(input).toBeVisible();
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAttribute('maxlength', '50');
  });

  test('Should show an error when the full name is empty', async () => {
    render(
      <>
        <FullNameInput />
        <TriggerValidation />
      </>,
      { wrapper: TestWrapper },
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Full name is required',
    );
  });

  test('Should show an error when the full name is too short', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('textbox', { name: /full name/i });

    await user.type(input, 'ab');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Full name must be at least 3 characters',
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('Should clear the error when the full name is valid', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('textbox', { name: /full name/i });

    await user.type(input, 'ab');
    await screen.findByRole('alert');

    await user.type(input, 'c');

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show an error when the full name is too long', async () => {
    renderComponent();

    const input = screen.getByRole('textbox', { name: /full name/i });

    fireEvent.change(input, { target: { value: 'a'.repeat(51) } });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Full name must be less than 50 characters',
    );
  });
});
