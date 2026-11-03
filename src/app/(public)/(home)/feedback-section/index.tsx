import { Testimonial } from './testimonial';
import { testimonials } from './data';
import styles from './styles.module.css';

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

      <div className={styles.testimonials} role="list">
        {testimonials.map(({ id, ...testimonial }) => (
          <div key={id} className={styles.testimonialItem} role="listitem">
            <Testimonial testimonial={testimonial} />
          </div>
        ))}
      </div>
    </section>
  );
};
