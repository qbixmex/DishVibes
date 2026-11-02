import type { FC } from 'react';
import { Star } from 'lucide-react';
import type { Testimonial as ITestimonial } from '@/shared/interfaces/testimonial.interface';
import styles from './styles.module.css';

const MAX_RATING = 5;

type Props = Readonly<{ testimonial: Omit<ITestimonial, 'id'> }>;

export const Testimonial: FC<Props> = ({ testimonial }) => {
  return (
    <figure className={styles.testimonial}>
      <blockquote className={styles.testimonialContent}>
        <p className={styles.review}>{testimonial.review}</p>
      </blockquote>
      <figcaption className={styles.testimonialFooter}>
        <p className={styles.customerName}>{testimonial.customerName}</p>
        <div
          className={styles.rating}
          role="img"
          aria-label={`Rating: ${testimonial.rating} out of ${MAX_RATING}`}
        >
          {Array.from({ length: testimonial.rating }).map((_, index) => (
            <Star key={index} aria-hidden="true" />
          ))}
        </div>
      </figcaption>
    </figure>
  );
};
