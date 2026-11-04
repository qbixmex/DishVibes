'use client';

import type { FC } from 'react';
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const PeopleInput: FC = () => {
  const {control} = useFormContext();

  return (
    <Controller
      name="people"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Number of persons</FieldLabel>
          <Input
            {...field}
            id="people"
            name={field.name}
            type="number"
            min={0}
            max={10}
            onChange={(e) => field.onChange(parseInt(e.target.value))}
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
