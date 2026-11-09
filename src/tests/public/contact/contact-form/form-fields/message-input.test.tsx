/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageInput } from '@/app/(public)/contact/(components)/contact-form/form-fields/message-input';
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

describe('Test on <MessageInput /> component', () => {
  const renderComponent = () => {
    render(<MessageInput />, { wrapper: TestWrapper });

    return { user: userEvent.setup() };
  };

  test('Should render the message textarea and counter', () => {
    renderComponent();

    const textarea = screen.getByRole('textbox', { name: /message/i });

    expect(textarea).toBeVisible();
    expect(textarea).toHaveValue('');
    expect(textarea).toHaveAttribute('maxlength', '255');
    expect(textarea).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByText('0/255')).toBeVisible();
    expect(screen.getByText('Up to 255 characters.')).toBeVisible();
  });

  test('Should update the counter while typing', async () => {
    const { user } = renderComponent();

    await user.type(
      screen.getByRole('textbox', { name: /message/i }),
      'Hello',
    );

    expect(screen.getByText('5/255')).toBeVisible();
  });

  test('Should show an error when the message is empty', async () => {
    render(
      <>
        <MessageInput />
        <TriggerValidation />
      </>,
      { wrapper: TestWrapper },
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Message is required',
    );
  });

  test('Should accept a message with exactly 255 characters', async () => {
    const { user } = renderComponent();

    const textarea = screen.getByRole('textbox', { name: /message/i });

    await user.type(textarea, 'a'.repeat(255));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(screen.getByText('255/255')).toBeVisible();
  });

  test('Should show an error when the message is too long', async () => {
    renderComponent();

    const textarea = screen.getByRole('textbox', { name: /message/i });

    fireEvent.change(textarea, { target: { value: 'a'.repeat(256) } });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Message must be 255 characters or less',
    );
    expect(screen.getByText('256/255')).toBeVisible();
  });
});
