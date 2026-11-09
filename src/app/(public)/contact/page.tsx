import type { FC } from 'react';
import { ContactView } from './(components)/contact-view';
import styles from './styles.module.css';

const ContactPage: FC = () => {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.heading}>
          Contact <span>Us</span>
        </h1>
        <p className={styles.subtitle}>
          Have a question, a comment, or a special request?
          <br />
          We will respond to you as soon as possible.
        </p>
      </header>

      <ContactView />
    </div>
  );
};

export default ContactPage;
