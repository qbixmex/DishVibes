'use client';

import type { FC } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import styles from './styles.module.css';

const formSchema = z.object({
  term: z
    .string('El valor debe ser una cadena de texto')
    .min(1, 'El termino de búsqueda es obligatorio'),
});

export const SearchDish: FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.table(data);
    form.clearErrors();
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <Controller
              name="term"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className={styles.input}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      className={styles.searchErrors}
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
          </div>
          <Button type="submit" variant="default">
            <Search className={styles.searchIcon} aria-hidden />
          </Button>
        </div>
      </form>
    </div>
  );
};
