'use client';

import { useId, type FC } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Inquiry } from '@/shared/interfaces/inquiry.interface';
import styles from './styles.module.css';

type Props = Readonly<{
  question: Inquiry;
  open: boolean;
  onToggle: () => void;
}>;

export const Question: FC<Props> = ({ question, open, onToggle }) => {
  const { icon: Icon } = question;
  const answerId = useId();

  return (
    <article className={styles.inquiry} data-open={open}>
      <header className={styles.header}>
        <div className={styles.iconContainer}>
          <Icon aria-hidden="true" />
        </div>
        <p className={styles.question}>{question.query}</p>
        <button
          type="button"
          className={styles.collapse}
          aria-expanded={open}
          aria-controls={answerId}
          aria-label={open ? 'Hide answer' : 'Show answer'}
          onClick={onToggle}
        >
          <ChevronDown className={styles.chevron} aria-hidden="true" />
        </button>
      </header>

      <div
        id={answerId}
        className={styles.answer}
        aria-hidden={!open}
      >
        <p>{question.answer}</p>
      </div>
    </article>
  );
};
