/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmailInput } from '@/app/(public)/contact/(components)/contact-form/form-fields/email-input';
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

describe('Test on <EmailInput /> component', () => {
  const renderComponent = () => {
    render(<EmailInput />, { wrapper: TestWrapper });

    return { user: userEvent.setup() };
  };

  test('Should render the email input', () => {
    renderComponent();

    const input = screen.getByRole('textbox', { name: /email/i });

    expect(input).toBeVisible();
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAttribute('maxlength', '120');
  });

  test('Should show an error when the email is empty', async () => {
    render(
      <>
        <EmailInput />
        <TriggerValidation />
      </>,
      { wrapper: TestWrapper },
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Email is required',
    );
  });

  test('Should show an error when the email format is invalid', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('textbox', { name: /email/i });

    await user.type(input, 'not-an-email');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Email must be a valid email address',
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('Should clear the error when the email is valid', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('textbox', { name: /email/i });

    await user.type(input, 'not-an-email');
    await screen.findByRole('alert');

    await user.clear(input);
    await user.type(input, 'john.doe@example.com');

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show an error when the email is too long', async () => {
    renderComponent();

    const input = screen.getByRole('textbox', { name: /email/i });

    fireEvent.change(input, {
      target: { value: `${'a'.repeat(120)}@example.com` },
    });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Email must be less than 120 characters',
    );
  });
});
