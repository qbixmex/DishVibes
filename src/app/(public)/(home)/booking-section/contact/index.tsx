import type { FC } from 'react';
import { AtSign, MapPin, Phone } from 'lucide-react';
import styles from './styles.module.css';

export const Contact: FC = () => {
  return (
    <div className={styles.contact}>
      <h2 className={styles.heading}>Contact <span>Information</span></h2>
      <div className={styles.info}>
        <div className={styles.row}>
          <div className={styles.iconContainer}>
            <Phone aria-hidden="true" />
          </div>
          <div>
            <h3 className={styles.infoHeading}>Phone:</h3>
            <p className={styles.contactData}>+1 232-555-1232</p>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.iconContainer}>
            <AtSign aria-hidden="true" />
          </div>
          <div>
            <h3 className={styles.infoHeading}>Email:</h3>
            <p className={styles.contactData}>contact@dishvibes.com</p>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.iconContainer}>
            <MapPin aria-hidden="true" />
          </div>
          <div>
            <h3 className={styles.infoHeading}>Address:</h3>
            <p className={styles.contactData}>900 Ganville Street, Vancouver, British Columbia</p>
          </div>
        </div>
      </div>
    </div>
  );
};
