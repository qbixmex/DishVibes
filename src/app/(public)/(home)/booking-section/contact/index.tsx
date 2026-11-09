import type { FC } from 'react';
import { contactDetails } from './data';
import styles from './styles.module.css';

export const Contact: FC = () => {
  return (
    <div className={styles.contact}>
      <h2 className={styles.heading}>
        Contact <span>Information</span>
      </h2>

      <div className={styles.info}>
        {
          contactDetails.map(({ id, label, value, icon: Icon }) => (
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
          ))
        }
      </div>
    </div>
  );
};
