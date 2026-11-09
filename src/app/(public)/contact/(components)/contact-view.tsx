import type { FC } from 'react';
import { ContactCard } from '@/shared/components';
import { ContactForm } from './contact-form';
import { LocationMap } from './location-map';
import styles from './styles.module.css';

export const ContactView: FC = () => {
  return (
    <div className={styles.view}>
      <div className={styles.columns}>
        <div className={styles.formColumn}>
          <ContactForm />
        </div>

        <div className={styles.infoColumn}>
          <ContactCard compact />
        </div>
      </div>

      <LocationMap />
    </div>
  );
};
