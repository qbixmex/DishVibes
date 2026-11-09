import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/app/(public)/contact/(components)/contact-form';

const { mockOnSubmit } = vi.hoisted(() => ({
  mockOnSubmit: vi.fn(),
}));

vi.mock(
  '@/app/(public)/contact/(components)/contact-form/use-contact-form',
  async () => {
    const { useForm } = await import('react-hook-form');

    return {
      useContactForm: () => ({
        form: useForm({
          defaultValues: {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 232-555-1232',
            message: 'I would like to know more about your menu.',
          },
        }),
        onSubmit: mockOnSubmit,
      }),
    };
  },
);

describe('Test on <ContactForm /> component', () => {
  const renderComponent = () => {
    render(<ContactForm />);

    return { user: userEvent.setup() };
  };

  beforeEach(() => {
    mockOnSubmit.mockImplementation(() => new Promise(() => {}));
  });

  test('Should render the heading and description', () => {
    renderComponent();

    const heading = screen.getByRole('heading', {
      level: 2,
      name: /send us a message/i,
    });

    expect(heading).toBeVisible();
    expect(heading).toHaveTextContent(/message/i);
    expect(
      screen.getByText(
        'Fill in the form and we will get back to you as soon as possible.',
      ),
    ).toBeVisible();
  });

  test('Should render every form field', () => {
    renderComponent();

    expect(screen.getByLabelText(/full name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue(
      'john.doe@example.com',
    );
    expect(screen.getByLabelText(/phone/i)).toHaveValue('+1 232-555-1232');
    expect(screen.getByLabelText(/^message$/i)).toHaveValue(
      'I would like to know more about your menu.',
    );
  });

  test('Should render an enabled submit button with the send message label', () => {
    renderComponent();

    const submitButton = screen.getByRole('button', {
      name: /send message/i,
    });

    expect(submitButton).toBeVisible();
    expect(submitButton).toBeEnabled();
  });

  test('Should submit the form with the current values', async () => {
    const { user } = renderComponent();

    await user.click(
      screen.getByRole('button', { name: /send message/i }),
    );

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 232-555-1232',
          message: 'I would like to know more about your menu.',
        }),
        expect.anything(),
      );
    });
  });

  test('Should show the loading state while submitting', async () => {
    const { user } = renderComponent();

    await user.click(
      screen.getByRole('button', { name: /send message/i }),
    );

    const loadingButton = await screen.findByRole('button', {
      name: /sending/i,
    });

    expect(loadingButton).toBeVisible();
    expect(loadingButton).toBeDisabled();
    expect(loadingButton.querySelector('svg')).toBeVisible();
  });
});
