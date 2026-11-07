'use client';

import type { FC } from 'react';
import { Controller, FormProvider, useWatch } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { OrderLine } from '@/shared/interfaces/order.interface';
import { useCheckoutForm } from './use-checkout-form';
import { FULFILLMENT_OPTIONS } from './checkout-schema';
import styles from '../styles.module.css';

type Props = Readonly<{
  lines: OrderLine[];
  onSuccess: (orderNumber: string) => void;
}>;

const FULFILLMENT_LABELS: Record<(typeof FULFILLMENT_OPTIONS)[number], string> = {
  pickup: 'Pickup',
  delivery: 'Delivery',
};

export const CheckoutForm: FC<Props> = ({ lines, onSuccess }) => {
  const { form, onSubmit } = useCheckoutForm({ lines, onSuccess });
  const fulfillment = useWatch({
    control: form.control,
    name: 'fulfillment',
  });

  return (
    <FormProvider {...form}>
      <form
        className={styles.form}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className={styles.fieldRow}>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="name"
                  placeholder="Jane Doe"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="tel"
                  autoComplete="tel"
                  placeholder="555 123 4567"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email (optional)</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>
                We will only use it to send your order confirmation.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="fulfillment"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Order type</FieldLabel>
              <select
                {...field}
                id={field.name}
                className={styles.select}
                aria-invalid={fieldState.invalid}
              >
                {FULFILLMENT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {FULFILLMENT_LABELS[option]}
                  </option>
                ))}
              </select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {fulfillment === 'delivery' && (
          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Delivery address</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  autoComplete="street-address"
                  placeholder="Street, number, city"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )}

        <Controller
          name="notes"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Order notes (optional)</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ''}
                id={field.name}
                rows={3}
                maxLength={250}
                placeholder="Anything we should know about this order?"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className={styles.submitButton}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className={styles.spinner} aria-hidden="true" />
              Placing order...
            </>
          ) : (
            'Place order'
          )}
        </Button>
      </form>
    </FormProvider>
  );
};
