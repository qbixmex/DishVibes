import type { FC } from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const NameInput: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="name"
      control={control}
      render={({ field, fieldState }) => (
        <FieldGroup>
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              name={field.name}
              aria-invalid={fieldState.invalid}
              type="text"
              autoComplete="off"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        </FieldGroup>
      )}
    />
  );
};
