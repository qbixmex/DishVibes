import { testimonials } from '../dishes-section/data';
import styles from './styles.module.css';
import { Testimonial } from './testimonial';

export const FeedbackSection = () => {
  return (
    <section
      className={styles.feedback}
      aria-labelledby="feedback-heading"
      aria-describedby="feedback-description"
    >
      <div className={styles.header}>
        <h2 id="feedback-heading" className={styles.heading}>
          Customers <span>Feedback</span>
        </h2>
        <p id="feedback-description" className={styles.description}>
          Testimonials and reviews.
        </p>
      </div>

      <ul className={styles.testimonials} role="list">
        {testimonials.map(({ id, ...testimonial }) => (
          <li key={id} className={styles.testimonialItem}>
            <Testimonial testimonial={testimonial} />
          </li>
        ))}
      </ul>
    </section>
  );
};
