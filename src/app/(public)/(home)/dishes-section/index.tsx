'use client';

import type { FC } from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { CategoriesSelector } from './categories-selector';
import { useDishCategoryStore } from '@/store/use-dish-category-store';
import { DishesSkeleton } from './dishes-grid/dishes-skeleton';
import styles from './styles.module.css';

const DishesGrid = dynamic(
  () => import('./dishes-grid').then((mod) => mod.DishesGrid),
  { ssr: false, loading: () => <DishesSkeleton /> },
);

export const DishesSection: FC = () => {
  const categoryId = useDishCategoryStore((state) => state.categoryId);

  return (
    <section className={styles.dishesSelector}>
      <CategoriesSelector />

      <Suspense
        key={categoryId ?? 'featured'}
        fallback={<DishesSkeleton />}
      >
        <DishesGrid categoryId={categoryId} />
      </Suspense>
    </section>
  );
};
