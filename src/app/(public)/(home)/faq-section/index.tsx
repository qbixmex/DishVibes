'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Question } from './question';
import { questions } from './question/data';
import { Headset } from 'lucide-react';
import styles from './styles.module.css';

export const FAQSection = () => {
  const [openId, setOpenId] = useState<string | null>(questions.at(0)?.id ?? null);

  return (
    <div className={styles.faq}>
      <div className={styles.layout}>
        <div className={styles.columnOne}>
          <div className={styles.card}>
            <div className={styles.cardHeading}>
              <h2 className={styles.heading}>Frequent <span>Asked Questions</span></h2>
              <p className={styles.description}>
                All you need to know before submit an order.
              </p>
            </div>

            <div className={styles.iconContainer}>
              <Headset className={styles.customerServiceIcon} aria-hidden="true" />
            </div>

            <div className={styles.cardInfo}>
              <div className={styles.cardInfoColumnOne}>
                <h3 className={styles.cardHeading}>Do you have a specific question ?</h3>
                <p className={styles.cardDescription}>Our customer service will attend your inquiries.</p>
              </div>
              <div className={styles.cardInfoColumnTwo}>
                <Link
                  href="#"
                  className={styles.contactLink}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.columnTwo}>
          <div className={styles.questions}>
            {questions.map((question) => (
              <Question
                key={question.id}
                question={question}
                open={question.id === openId}
                onToggle={() => setOpenId(prev => (prev === question.id ? null : question.id))}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
