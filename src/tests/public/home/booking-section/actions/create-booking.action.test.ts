import { createBookingAction } from '@/app/(public)/(home)/booking-section/actions/create-booking.action';

vi.mock('@/lib/utils', () => ({
  sleep: vi.fn().mockResolvedValue(undefined),
}));

const BOOKING_DATE = new Date(2026, 0, 15, 12).toISOString();

const createFormData = ({
  name = 'John Doe',
  phone = '1234567890',
  people = '2',
  bookingDate = BOOKING_DATE,
}: Partial<Record<string, string>> = {}) => {
  const formData = new FormData();

  formData.append('name', name);
  formData.append('phone', phone);
  formData.append('people', people);
  formData.append('bookingDate', bookingDate);

  return formData;
};

describe('Tests on createBookingAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should create a booking when every field is valid', async () => {
    const response = await createBookingAction(createFormData());

    expect(response).toEqual({
      success: true,
      error: null,
    });
    expect(console.log).toHaveBeenCalled();
  });

  test('Should coerce the people field to a number', async () => {
    const response = await createBookingAction(createFormData({ people: '4' }));

    expect(response.success).toBe(true);
    expect(response.error).toBeNull();
  });

  test('Should reject an empty name', async () => {
    const response = await createBookingAction(createFormData({ name: '' }));

    expect(response).toEqual({
      success: false,
      error: 'Name is required',
    });
  });

  test('Should reject a name shorter than three characters', async () => {
    const response = await createBookingAction(createFormData({ name: 'ab' }));

    expect(response).toEqual({
      success: false,
      error: 'Name is must be 3 characters length',
    });
  });

  test('Should reject a name longer than one hundred characters', async () => {
    const response = await createBookingAction(
      createFormData({ name: 'a'.repeat(101) }),
    );

    expect(response).toEqual({
      success: false,
      error: 'Name must be less than 100 characters',
    });
  });

  test('Should reject a phone shorter than ten characters', async () => {
    const response = await createBookingAction(
      createFormData({ phone: '123' }),
    );

    expect(response).toEqual({
      success: false,
      error: 'Phone must be more than 10 characters length',
    });
  });

  test('Should reject a phone longer than twenty characters', async () => {
    const response = await createBookingAction(
      createFormData({ phone: '1'.repeat(21) }),
    );

    expect(response).toEqual({
      success: false,
      error: 'Phone must be less than 20 characters length',
    });
  });

  test('Should reject a number of people equal to zero', async () => {
    const response = await createBookingAction(createFormData({ people: '0' }));

    expect(response).toEqual({
      success: false,
      error: 'People must be greater than 0',
    });
  });

  test('Should default the people field to zero when it is missing', async () => {
    const formData = createFormData();
    formData.delete('people');

    const response = await createBookingAction(formData);

    expect(response).toEqual({
      success: false,
      error: 'People must be greater than 0',
    });
  });

  test('Should reject an invalid booking date', async () => {
    const response = await createBookingAction(
      createFormData({ bookingDate: 'not-a-date' }),
    );

    expect(response).toEqual({
      success: false,
      error: 'Booking date must be a valid date',
    });
  });

  test('Should default the booking date to the current date when missing', async () => {
    const formData = createFormData();
    formData.delete('bookingDate');

    const response = await createBookingAction(formData);

    expect(response).toEqual({
      success: true,
      error: null,
    });
  });
});
