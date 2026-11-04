import type { ReactNode } from 'react';
import { useEffect } from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { DateTimeSelect } from '@/app/(public)/(home)/booking-section/booking-form/form-fields/datetime-select';
import { bookingSchema } from '@/app/(public)/(home)/booking-section/booking-form/booking-schema';

type BookingValues = z.infer<typeof bookingSchema>;

const VALID_DATE = new Date(2026, 0, 15, 10, 30, 0);

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema) as any,
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      people: 0,
      bookingDate: undefined,
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const bookingDate = useWatch({ name: 'bookingDate' }) as Date | undefined;

  const value = bookingDate
    ? `${bookingDate.getFullYear()}-${bookingDate.getMonth() + 1}-${bookingDate.getDate()} ${bookingDate.getHours()}:${String(bookingDate.getMinutes()).padStart(2, '0')}:${String(bookingDate.getSeconds()).padStart(2, '0')}`
    : 'none';

  return <span data-testid="booking-date">{value}</span>;
}

function SetValidDate() {
  const { setValue } = useFormContext();

  useEffect(() => {
    setValue('bookingDate', VALID_DATE, { shouldValidate: true });
  }, [setValue]);

  return null;
}

function TriggerValidation() {
  const { trigger } = useFormContext();

  useEffect(() => {
    trigger();
  }, [trigger]);

  return null;
}

describe('Test on <DateTimeSelect /> component', () => {
  const renderComponent = (children: ReactNode = <DateTimeSelect />) => {
    render(children, { wrapper: TestWrapper });

    return { user: userEvent.setup() };
  };

  test('Should render the date placeholder and the default time', () => {
    renderComponent();

    const dateButton = screen.getByLabelText(/date/i);
    const timeInput = screen.getByLabelText(/hour/i);

    expect(dateButton).toBeVisible();
    expect(dateButton).toHaveTextContent(/seleccione fecha/i);
    expect(timeInput).toBeVisible();
    expect(timeInput).toHaveValue('00:00:00');
    expect(dateButton).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show an error when the booking date is empty', async () => {
    renderComponent(
      <>
        <DateTimeSelect />
        <TriggerValidation />
      </>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Booking date must be a valid date',
    );
  });

  test('Should render the formatted date when the form value is set', async () => {
    renderComponent(
      <>
        <DateTimeSelect />
        <SetValidDate />
        <FormValueDisplay />
      </>,
    );

    const dateButton = screen.getByLabelText(/date/i);

    await waitFor(() => {
      expect(dateButton).toHaveTextContent(/15 de enero del 2026/i);
    });
    expect(screen.getByTestId('booking-date')).toHaveTextContent(
      '2026-1-15 10:30:00',
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should sync the time input with an externally set date', async () => {
    renderComponent(
      <>
        <DateTimeSelect />
        <SetValidDate />
      </>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/hour/i)).toHaveValue('10:30:00');
    });
  });

  test('Should open the calendar when the date button is clicked', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByLabelText(/date/i));

    const grid = await screen.findByRole('grid');

    expect(grid).toBeVisible();
  });

  test('Should update the form value when a date is selected', async () => {
    const { user } = renderComponent(
      <>
        <DateTimeSelect />
        <FormValueDisplay />
      </>,
    );

    await user.click(screen.getByLabelText(/date/i));

    await screen.findByRole('grid');

    const [monthSelect, yearSelect] = screen.getAllByRole('combobox');

    await user.selectOptions(yearSelect, '2026');
    await user.selectOptions(monthSelect, '0');

    const grid = await screen.findByRole('grid');

    await waitFor(() => {
      expect(grid).toHaveAccessibleName(/january 2026/i);
    });

    const day = within(grid).getByRole('button', {
      name: /january 15th, 2026/i,
    });

    await user.click(day);

    expect(screen.getByTestId('booking-date')).toHaveTextContent(
      '2026-1-15 0:00:00',
    );
    expect(screen.getByLabelText(/date/i)).toHaveTextContent(
      /15 de enero del 2026/i,
    );
  });

  test('Should keep the selected date when the time changes', async () => {
    renderComponent(
      <>
        <DateTimeSelect />
        <SetValidDate />
        <FormValueDisplay />
      </>,
    );

    const timeInput = screen.getByLabelText(/hour/i);

    await waitFor(() => {
      expect(timeInput).toHaveValue('10:30:00');
    });

    fireEvent.change(timeInput, { target: { value: '12:45:00' } });

    expect(screen.getByTestId('booking-date')).toHaveTextContent(
      '2026-1-15 12:45:00',
    );
    expect(timeInput).toHaveValue('12:45:00');
  });

  test('Should not update the form value when the time changes without a date', () => {
    renderComponent(
      <>
        <DateTimeSelect />
        <FormValueDisplay />
      </>,
    );

    fireEvent.change(screen.getByLabelText(/hour/i), {
      target: { value: '09:00:00' },
    });

    expect(screen.getByTestId('booking-date')).toHaveTextContent('none');
  });
});
