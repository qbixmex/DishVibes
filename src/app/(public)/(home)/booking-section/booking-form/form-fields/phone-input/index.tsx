import type { FC } from 'react';

import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const PhoneInput: FC = () => {
  const {control} = useFormContext();

  return (
    <Controller
      name="phone"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
          <Input
            {...field}
            id="phone"
            name={field.name}
            type="text"
            aria-invalid={fieldState.invalid}
            autoComplete="off"
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
