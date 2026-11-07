import type { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import styles from '../styles.module.css';

const SKELETON_ITEMS = [0, 1];

export const OrderItemsSkeleton: FC = () => {
  return (
    <div className={styles.itemsSkeleton} aria-hidden="true">
      {SKELETON_ITEMS.map((item) => (
        <div key={item} className={styles.itemSkeleton}>
          <Skeleton className={styles.itemSkeletonImage} />
          <div className={styles.itemSkeletonContent}>
            <Skeleton className={styles.itemSkeletonTitle} />
            <Skeleton className={styles.itemSkeletonLine} />
            <Skeleton className={styles.itemSkeletonLineShort} />
          </div>
        </div>
      ))}
    </div>
  );
};
