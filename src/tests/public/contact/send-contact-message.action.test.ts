import { sendContactMessageAction } from '@/app/(public)/contact/(actions)/send-contact-message.action';

vi.mock('@/lib/utils', () => ({
  sleep: vi.fn().mockResolvedValue(undefined),
}));

const createFormData = ({
  fullName = 'John Doe',
  email = 'john.doe@example.com',
  phone = '+1 232-555-1232',
  message = 'I would like to know more about your menu.',
}: Partial<Record<string, string>> = {}) => {
  const formData = new FormData();

  formData.append('fullName', fullName);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('message', message);

  return formData;
};

describe('Tests on sendContactMessageAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should send the message when every field is valid', async () => {
    const response = await sendContactMessageAction(createFormData());

    expect(response).toEqual({
      success: true,
      error: null,
    });
    expect(console.log).toHaveBeenCalled();
  });

  test('Should reject an empty full name', async () => {
    const response = await sendContactMessageAction(
      createFormData({ fullName: '' }),
    );

    expect(response).toEqual({
      success: false,
      error: 'Full name is required',
    });
  });

  test('Should reject a full name shorter than three characters', async () => {
    const response = await sendContactMessageAction(
      createFormData({ fullName: 'ab' }),
    );

    expect(response).toEqual({
      success: false,
      error: 'Full name must be at least 3 characters',
    });
  });

  test('Should reject a full name longer than fifty characters', async () => {
    const response = await sendContactMessageAction(
      createFormData({ fullName: 'a'.repeat(51) }),
    );

    expect(response).toEqual({
      success: false,
      error: 'Full name must be less than 50 characters',
    });
  });

  test('Should reject an invalid email', async () => {
    const response = await sendContactMessageAction(
      createFormData({ email: 'not-an-email' }),
    );

    expect(response).toEqual({
      success: false,
      error: 'Email must be a valid email address',
    });
  });

  test('Should reject a phone longer than fifty characters', async () => {
    const response = await sendContactMessageAction(
      createFormData({ phone: '1'.repeat(51) }),
    );

    expect(response).toEqual({
      success: false,
      error: 'Phone must be less than 50 characters',
    });
  });

  test('Should reject a message longer than 255 characters', async () => {
    const response = await sendContactMessageAction(
      createFormData({ message: 'a'.repeat(256) }),
    );

    expect(response).toEqual({
      success: false,
      error: 'Message must be 255 characters or less',
    });
  });

  test('Should reject a submission with missing fields', async () => {
    const response = await sendContactMessageAction(new FormData());

    expect(response.success).toBe(false);
    expect(response.error).toBe('Full name must be a valid string');
  });
});
