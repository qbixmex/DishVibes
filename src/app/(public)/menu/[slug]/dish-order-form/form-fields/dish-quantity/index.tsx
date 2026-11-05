'use client';

import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Minus, Plus } from 'lucide-react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  type DishOrderValues,
} from '../../dish-order-schema';
import styles from './styles.module.css';

const clampQuantity = (value: number) => {
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, value));
};

export const DishQuantity: FC = () => {
  const { control } = useFormContext<DishOrderValues>();

  return (
    <Controller
      name="quantity"
      control={control}
      render={({ field, fieldState }) => {
        const quantity = clampQuantity(Number(field.value) || MIN_QUANTITY);

        const onDecrement = () => {
          field.onChange(clampQuantity(quantity - 1));
        };

        const onIncrement = () => {
          field.onChange(clampQuantity(quantity + 1));
        };

        const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const nextQuantity = Number.parseInt(event.target.value, 10);

          field.onChange(
            Number.isNaN(nextQuantity) ? MIN_QUANTITY : clampQuantity(nextQuantity),
          );
        };

        return (
          <Field
            data-invalid={fieldState.invalid}
            className={styles.field}
          >
            <FieldLabel htmlFor={field.name}>Quantity</FieldLabel>

            <div className={styles.stepper}>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onDecrement}
                disabled={quantity <= MIN_QUANTITY}
                aria-label="Decrease quantity"
              >
                <Minus aria-hidden="true" />
              </Button>

              <input
                {...field}
                id={field.name}
                type="number"
                inputMode="numeric"
                min={MIN_QUANTITY}
                max={MAX_QUANTITY}
                value={quantity}
                onChange={onQuantityChange}
                aria-invalid={fieldState.invalid}
                className={styles.input}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onIncrement}
                disabled={quantity >= MAX_QUANTITY}
                aria-label="Increase quantity"
              >
                <Plus aria-hidden="true" />
              </Button>
            </div>

            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
};
