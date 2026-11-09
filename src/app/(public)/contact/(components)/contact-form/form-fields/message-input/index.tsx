import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type { ContactValues } from '../../contact-schema';
import styles from './styles.module.css';

export const MESSAGE_MAX_LENGTH = 255;

export const MessageInput: FC = () => {
  const { control } = useFormContext<ContactValues>();

  return (
    <Controller
      name="message"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className={styles.labelRow}>
            <FieldLabel htmlFor={field.name}>Message</FieldLabel>
            <span className={styles.counter} aria-hidden="true">
              {field.value?.length ?? 0}/{MESSAGE_MAX_LENGTH}
            </span>
          </div>
          <Textarea
            {...field}
            id={field.name}
            placeholder="How can we help you?"
            maxLength={MESSAGE_MAX_LENGTH}
            aria-invalid={fieldState.invalid}
            className={styles.textarea}
          />
          <FieldDescription>Up to 255 characters.</FieldDescription>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
