/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneInput } from '@/app/(public)/contact/(components)/contact-form/form-fields/phone-input';
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
    expect(input).toHaveAttribute('type', 'tel');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAttribute('maxlength', '50');
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

  test('Should accept a phone with exactly fifty characters', async () => {
    const { user } = renderComponent();

    const input = screen.getByRole('textbox', { name: /phone/i });

    await user.type(input, '1'.repeat(50));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show an error when the phone is too long', async () => {
    renderComponent();

    const input = screen.getByRole('textbox', { name: /phone/i });

    fireEvent.change(input, { target: { value: '1'.repeat(51) } });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Phone must be less than 50 characters',
    );
  });
});
