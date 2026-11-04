import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from '@/app/(public)/(home)/booking-section/booking-form';

const { mockOnSubmit } = vi.hoisted(() => ({
  mockOnSubmit: vi.fn(),
}));

vi.mock(
  '@/app/(public)/(home)/booking-section/booking-form/use-booking-form',
  async () => {
    const { useForm } = await import('react-hook-form');

    return {
      useBookingForm: () => ({
        form: useForm({
          defaultValues: {
            name: 'John Doe',
            phone: '1234567890',
            people: 2,
            bookingDate: new Date(2026, 0, 15, 12),
          },
        }),
        onSubmit: mockOnSubmit,
      }),
    };
  },
);

describe('Test on <BookingForm /> component', () => {
  const renderComponent = () => {
    render(<BookingForm />);

    return { user: userEvent.setup() };
  };

  beforeEach(() => {
    mockOnSubmit.mockImplementation(() => new Promise(() => {}));
  });

  test('Should render the heading', () => {
    renderComponent();

    const heading = screen.getByRole('heading', {
      level: 2,
      name: /make reservation/i,
    });

    expect(heading).toBeVisible();
    expect(heading).toHaveTextContent(/reservation/i);
  });

  test('Should render every form field', () => {
    renderComponent();

    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('1234567890');
    expect(screen.getByLabelText(/number of persons/i)).toHaveValue(2);
    expect(screen.getByLabelText(/date/i)).toHaveTextContent(
      /15 de enero del 2026/i,
    );
    expect(screen.getByLabelText(/hour/i)).toHaveValue('12:00:00');
  });

  test('Should render an enabled submit button with the book label', () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /book/i });

    expect(submitButton).toBeVisible();
    expect(submitButton).toBeEnabled();
  });

  test('Should submit the form with the current values', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByRole('button', { name: /book/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          phone: '1234567890',
          people: 2,
        }),
        expect.anything(),
      );
    });
  });

  test('Should show the loading state while submitting', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByRole('button', { name: /book/i }));

    const loadingButton = await screen.findByRole('button', {
      name: /wait/i,
    });

    expect(loadingButton).toBeVisible();
    expect(loadingButton).toBeDisabled();
    expect(loadingButton.querySelector('svg')).toBeVisible();
  });
});
