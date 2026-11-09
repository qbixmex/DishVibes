import type { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { contactDetails } from './data';
import styles from './styles.module.css';

type Props = Readonly<{
  heading?: ReactNode;
  compact?: boolean;
}>;

export const ContactCard: FC<Props> = ({ heading, compact = false }) => {
  return (
    <section
      className={cn(styles.contact, { [styles.compact]: compact })}
      aria-labelledby="contact-card-heading"
    >
      <h2 id="contact-card-heading" className={styles.heading}>
        {heading ?? (
          <>
            Contact <span>Information</span>
          </>
        )}
      </h2>

      <div className={styles.info}>
        {contactDetails.map(({ id, label, value, icon: Icon }) => (
          <div key={id} className={styles.row}>
            <div className={styles.columnOne}>
              <div className={styles.iconContainer}>
                <Icon aria-hidden="true" className={styles.icon} />
              </div>
            </div>
            <div className={styles.columnTwo}>
              <h3 className={styles.dataHeading}>{label}:</h3>
              <p className={styles.dataValue}>{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
