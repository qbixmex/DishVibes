import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { ContactValues } from '../../contact-schema';

export const PhoneInput: FC = () => {
  const { control } = useFormContext<ContactValues>();

  return (
    <Controller
      name="phone"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
          <Input
            {...field}
            id={field.name}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={50}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
