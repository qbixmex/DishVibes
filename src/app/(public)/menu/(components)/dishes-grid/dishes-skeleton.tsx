import type { FC } from 'react';
import { DishSkeleton } from '@/app/(public)/(components)/dish-item/dish-skeleton';
import styles from './styles.module.css';

type Props = Readonly<{ quantity?: number; }>;

export const DishesSkeleton: FC<Props> = ({ quantity = 4 }) => {
  return (
    <div
      className={`${styles.dishesGrid} animate-pulse`}
      aria-busy="true"
      data-testid="menu-dishes-skeleton"
    >
      {Array.from({ length: quantity }).map((_, index) => (
        <DishSkeleton key={`menu-dish-skeleton-${index + 1}`} />
      ))}
    </div>
  );
};
