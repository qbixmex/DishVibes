'use client';

import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type { DishOrderValues } from '../../dish-order-schema';
import styles from './styles.module.css';

export const SpecialInstructions: FC = () => {
  const { control } = useFormContext<DishOrderValues>();

  return (
    <Controller
      name="specialInstructions"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Special instructions (optional)</FieldLabel>
          <Textarea
            {...field}
            id={field.name}
            placeholder="Anything we should know before preparing your order?"
            maxLength={250}
            aria-invalid={fieldState.invalid}
            className={styles.textarea}
          />
          <FieldDescription>
            Optional. We will do our best to accommodate your request.
          </FieldDescription>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
