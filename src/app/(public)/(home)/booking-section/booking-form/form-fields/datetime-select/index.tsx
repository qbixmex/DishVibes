'use client';

import { type FC, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from "./styles.module.css";

const YEARS_AHEAD = 10;

export const DateTimeSelect: FC = () => {
  const {control} = useFormContext();
  const bookingDate = useWatch({ name: 'bookingDate' }) as Date | undefined;

  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>(
    bookingDate ? format(bookingDate, 'HH:mm:ss') : '00:00:00',
  );
  const [syncedMatchDate, setSyncedMatchDate] = useState(bookingDate);

  // `new Date()` (and `Date.now()`) is an unstable value: reading it during
  // render fails the Cache Components prerender, because the value would be
  // baked into the static shell instead of being recomputed on each visit.
  // Compute the calendar bound in an event handler so the read only happens on
  // the client, when the popover is actually opened.
  const [endMonth, setEndMonth] = useState<Date>();

  const handleCalendarOpenChange = (open: boolean) => {
    if (open && !endMonth) {
      setEndMonth(new Date(new Date().getFullYear() + YEARS_AHEAD, 11));
    }

    setOpenCalendar(open);
  };

  // Reset the local time input whenever the form value changes (e.g.
  // `form.reset()`). Adjusting state during render is the recommended pattern
  // for syncing with a value.
  if (bookingDate !== syncedMatchDate) {
    setSyncedMatchDate(bookingDate);
    setSelectedTime(
      bookingDate ? format(new Date(bookingDate), 'HH:mm:ss') : '00:00:00',
    );
  }

  return (
    <Controller
      name="bookingDate"
      control={control}
      render={({ field, fieldState }) => {
        const handleDateSelect = (date: Date | undefined) => {
          if (!date) return;

          const [hours, minutes, seconds] = selectedTime.split(':').map(Number);
          const combined = new Date(date);
          combined.setHours(hours, minutes, seconds, 0);
          field.onChange(combined);
          setOpenCalendar(false);
        };

        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = !e.target.value ? '00:00:00' : e.target.value;
          setSelectedTime(value);
          if (bookingDate) {
            const [hours, minutes, seconds] = value.split(':').map(Number);
            const combined = new Date(bookingDate);
            combined.setHours(hours, minutes, seconds);
            field.onChange(combined);
          }
        };

        return (
          <section className={styles.dateTime}>
            <Field className={styles.date} data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Date</FieldLabel>
              <Popover open={openCalendar} onOpenChange={handleCalendarOpenChange}>
                <PopoverTrigger
                  render={
                    <Button
                      id={field.name}
                      variant="secondary"
                      className={styles.triggerButton}
                      aria-invalid={fieldState.invalid}
                    >
                      {
                        bookingDate
                          ? format(bookingDate, "d 'de' MMMM 'del' yyyy", { locale: es })
                          : (
                            <span>
                              Seleccione Fecha&nbsp;
                              <span className={styles.optionalText}>(optional)</span>
                            </span>
                          )
                      }
                      <ChevronDownIcon />
                    </Button>
                  }
                />
                <PopoverContent className={styles.popOverCalendar} align="start">
                  <Calendar
                    mode="single"
                    startMonth={new Date(2020, 0)}
                    endMonth={endMonth}
                    selected={bookingDate}
                    defaultMonth={bookingDate}
                    captionLayout="dropdown"
                    onSelect={handleDateSelect}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>

            <Field className={styles.hour}>
              <FieldLabel htmlFor="time-picker">Hour</FieldLabel>
              <Input
                id="time-picker"
                type="time"
                step="1"
                min="00:00:00"
                value={selectedTime}
                onChange={handleTimeChange}
                aria-invalid={fieldState.invalid}
              />
            </Field>
          </section>
        );
      }}
    />
  );
};
