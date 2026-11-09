'use client';

import type { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FullNameInput } from './form-fields/full-name-input';
import { EmailInput } from './form-fields/email-input';
import { PhoneInput } from './form-fields/phone-input';
import { MessageInput } from './form-fields/message-input';
import { useContactForm } from './use-contact-form';
import styles from './styles.module.css';

export const ContactForm: FC = () => {
  const { form, onSubmit } = useContactForm();

  return (
    <section className={styles.card} aria-labelledby="contact-form-heading">
      <header className={styles.header}>
        <h2 id="contact-form-heading" className={styles.heading}>
          Send us a <span>Message</span>
        </h2>
        <p className={styles.description}>
          Fill in the form and we will get back to you as soon as possible.
        </p>
      </header>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className={styles.formInputs}>
            <FullNameInput />
            <div className={styles.twoColumn}>
              <EmailInput />
              <PhoneInput />
            </div>
            <MessageInput />
          </div>

          <div className={styles.submitContainer}>
            <Button
              type="submit"
              className={styles.submitBtn}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? (
                  <span className={styles.submitContent}>
                    Sending
                    <Loader2 className={styles.spinner} aria-hidden="true" />
                  </span>
                )
                : (
                  <span className={styles.submitContent}>
                    Send message
                    <Send aria-hidden="true" />
                  </span>
                )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};
