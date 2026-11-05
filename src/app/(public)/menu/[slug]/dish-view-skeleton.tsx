import type { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import styles from './styles.module.css';

export const DishViewSkeleton: FC = () => {
  return (
    <div
      className={styles.dishDetails}
      aria-busy="true"
      data-testid="dish-view-skeleton"
    >
      <span className="visually-hidden">Loading dish details</span>

      <Skeleton className={styles.backLinkSkeleton} />

      <div className={styles.columns}>
        <Skeleton className={styles.imageSkeleton} />

        <div className={styles.columnB}>
          <div className={styles.header}>
            <Skeleton className={styles.titleSkeleton} />
            <Skeleton className={styles.lineSkeleton} />
            <Skeleton className={styles.lineSkeleton} />
            <Skeleton className={styles.priceSkeleton} />
          </div>

          <div className={styles.formSkeleton}>
            <Skeleton className={styles.fieldSkeleton} />
            <Skeleton className={styles.fieldSkeleton} />
            <Skeleton className={styles.buttonSkeleton} />
          </div>
        </div>
      </div>
    </div>
  );
};
