'use client';

import type { FC } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { CategoryItem } from './category-item';
import { categories } from '@/shared/data/categories';
import styles from './styles.module.css';

export const CategoriesSelector: FC = () => {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    breakpoints: {
      '(min-width: 1024px)': { active: false },
    },
  });

  return (
    <div className={styles.dishesSection}>
      <div
        ref={emblaRef}
        className={styles.viewport}
        role="region"
        aria-roledescription="carousel"
        aria-label="Categories"
      >
        <div className={styles.categories}>
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${categories.length}`}
            >
              <CategoryItem category={category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
