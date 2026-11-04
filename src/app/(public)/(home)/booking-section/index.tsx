import type { FC } from 'react';
import { BookingForm } from './booking-form';
import { Contact } from './contact';
import styles from './styles.module.css';

export const BookingSection: FC = () => {
  return (
    <div className={styles.booking}>
      <div className={styles.columnOne}>
        <BookingForm />
      </div>
      <div className={styles.columnTwo}>
        <Contact />
      </div>
    </div>
  );
};
