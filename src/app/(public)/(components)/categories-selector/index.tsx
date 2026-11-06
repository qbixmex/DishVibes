'use client';

import type { FC } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { CategoryItem } from './category-item';
import { categories } from '@/shared/data/categories';
import styles from './styles.module.css';

type Props = Readonly<{
  selectedCategoryId: string | null;
  onSelect: (categoryId: string) => void;
}>;

export const CategoriesSelector: FC<Props> = ({ selectedCategoryId, onSelect }) => {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    breakpoints: {
      '(min-width: 1024px)': { active: false },
    },
  });

  return (
    <div className={styles.selector}>
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
              <CategoryItem
                category={category}
                isSelected={category.id === selectedCategoryId}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
