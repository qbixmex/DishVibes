import { act, renderHook } from '@testing-library/react';
import {
  CONTACT_FORM_DEFAULT_VALUES,
  useContactForm,
} from '@/app/(public)/contact/(components)/contact-form/use-contact-form';

const { mockSendContactMessageAction } = vi.hoisted(() => ({
  mockSendContactMessageAction: vi.fn<
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
  '@/app/(public)/contact/(actions)/send-contact-message.action',
  () => ({
    sendContactMessageAction: mockSendContactMessageAction,
  }),
);

const validData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 232-555-1232',
  message: 'I would like to know more about your menu.',
};

describe('Tests on useContactForm hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSendContactMessageAction.mockResolvedValue({
      success: true,
      error: null,
    });
  });

  test('Should initialize the form with empty default values', () => {
    const { result } = renderHook(() => useContactForm());

    expect(result.current.form.getValues()).toEqual(
      CONTACT_FORM_DEFAULT_VALUES,
    );
  });

  test('Should send every field as form data when submitting', async () => {
    const { result } = renderHook(() => useContactForm());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockSendContactMessageAction).toHaveBeenCalledTimes(1);

    const formData = mockSendContactMessageAction.mock.calls[0][0];

    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get('fullName')).toBe(validData.fullName);
    expect(formData.get('email')).toBe(validData.email);
    expect(formData.get('phone')).toBe(validData.phone);
    expect(formData.get('message')).toBe(validData.message);
  });

  test('Should show a success toast and reset the form on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.form.setValue('fullName', 'Jane Doe');
    });

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith(
      'Message sent successfully',
      {
        description: 'Thanks for reaching out. We will get back to you soon.',
        className: 'text-balance',
        duration: 5000,
      },
    );
    expect(result.current.form.getValues()).toEqual(
      CONTACT_FORM_DEFAULT_VALUES,
    );
  });

  test('Should show an error toast and keep the values on failure', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useContactForm());

    mockSendContactMessageAction.mockResolvedValue({
      success: false,
      error: 'Email must be a valid email address',
    });

    act(() => {
      result.current.form.setValue('fullName', 'Jane Doe');
    });

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith(
      'There was an error sending your message',
      {
        description: 'Email must be a valid email address',
        duration: 5000,
      },
    );
    expect(toast.success).not.toHaveBeenCalled();
    expect(result.current.form.getValues('fullName')).toBe('Jane Doe');
  });
});
