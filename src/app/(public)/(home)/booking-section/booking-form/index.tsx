'use client';

import type { FC } from 'react';
import { DateTimeSelect } from './form-fields/datetime-select';
import { PeopleInput } from './form-fields/people-input';
import { NameInput } from './form-fields/name-input';
import { PhoneInput } from './form-fields/phone-input';
import { Button } from '@/components/ui/button';
import { useBookingForm } from './use-booking-form';
import { FormProvider } from 'react-hook-form';
import { cn } from 'cn';
import { Loader2 } from 'lucide-react';
import styles from './styles.module.css';

export const BookingForm: FC = () => {
  const { form, onSubmit } = useBookingForm();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Make <span>Reservation</span></h2>
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={styles.formInputs}>
            <NameInput />
            <div className={styles.twoColumn}>
              <PhoneInput />
              <PeopleInput />
            </div>
            <DateTimeSelect />
          </div>
          <div className={cn({ 'animate-pulse': form.formState.isSubmitting })}>
            <Button
              type="submit"
              className={cn(styles.submitBtn, {
                [styles.disableBtn]: form.formState.isSubmitting,
              })}
              disabled={form.formState.isSubmitting}
            >
              {
                form.formState.isSubmitting
                  ? (
                    <div className="flex justify-center items-center gap-2">
                      wait
                      <Loader2 className="animate-spin" />
                    </div>
                  )
                  : 'book'
              }
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
