import type { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import styles from '../../styles.module.css';

const SKELETON_ITEMS = [0, 1, 2];

export const SuggestionsSkeleton: FC = () => {
  return (
    <div
      className={styles.suggestionsGrid}
      aria-busy="true"
      data-testid="suggestions-skeleton"
    >
      {SKELETON_ITEMS.map((item) => (
        <div
          key={`suggestion-skeleton-${item + 1}`}
          className={styles.suggestionCard}
          aria-hidden="true"
        >
          <Skeleton className={styles.suggestionSkeletonImage} />
          <div className={styles.suggestionSkeletonBody}>
            <Skeleton className={styles.suggestionSkeletonTitle} />
            <Skeleton className={styles.suggestionSkeletonLine} />
            <Skeleton className={styles.suggestionSkeletonPrice} />
          </div>
          <Skeleton className={styles.suggestionSkeletonButton} />
        </div>
      ))}
    </div>
  );
};
