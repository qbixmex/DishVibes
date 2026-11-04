import { act, renderHook } from '@testing-library/react';
import { useBookingForm } from '@/app/(public)/(home)/booking-section/booking-form/use-booking-form';

const { mockCreateBookingAction } = vi.hoisted(() => ({
  mockCreateBookingAction: vi.fn<
    (formData: FormData) => Promise<{
      success: boolean;
      error: string | null;
    }>
  >(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock(
  '@/app/(public)/(home)/booking-section/actions/create-booking.action',
  () => ({
    createBookingAction: mockCreateBookingAction,
  }),
);

const validData = {
  name: 'John Doe',
  phone: '1234567890',
  people: 2,
  bookingDate: new Date(2026, 0, 15, 12, 30),
};

describe('Tests on useBookingForm hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCreateBookingAction.mockResolvedValue({
      success: true,
      error: null,
    });
  });

  test('Should initialize the form with empty default values', () => {
    const { result } = renderHook(() => useBookingForm());

    expect(result.current.form.getValues()).toEqual({
      name: '',
      phone: '',
      people: 0,
      bookingDate: undefined,
    });
  });

  test('Should send every field as form data when submitting', async () => {
    const { result } = renderHook(() => useBookingForm());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateBookingAction).toHaveBeenCalledTimes(1);

    const formData = mockCreateBookingAction.mock.calls[0][0];

    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get('name')).toBe(validData.name);
    expect(formData.get('phone')).toBe(validData.phone);
    expect(formData.get('people')).toBe('2');
    expect(formData.get('bookingDate')).toBe(
      validData.bookingDate.toISOString(),
    );
  });

  test('Should show a success toast and reset the form on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useBookingForm());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith(
      'Booking created successfully',
      {
        description:
          'Your reservation is made, check your email address for confirmation.',
        className: 'text-balance',
        duration: 5000,
      },
    );
    expect(result.current.form.getValues()).toEqual({
      name: '',
      phone: '',
      people: 0,
      bookingDate: undefined,
    });
  });

  test('Should show an error toast and keep the values on failure', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useBookingForm());

    mockCreateBookingAction.mockResolvedValue({
      success: false,
      error: 'Name is required',
    });

    act(() => {
      result.current.form.setValue('name', 'Jane Doe');
    });

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith(
      'There was an error on the form',
      {
        description: 'Name is required',
        duration: 5000,
      },
    );
    expect(toast.success).not.toHaveBeenCalled();
    expect(result.current.form.getValues('name')).toBe('Jane Doe');
  });
});
