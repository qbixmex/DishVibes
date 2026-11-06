'use client';

import type { FC } from 'react';
import { Suspense, use } from 'react';
import dynamic from 'next/dynamic';
import { CategoriesSelector } from './categories-selector';
import { firstCategoryId } from '@/shared/data/categories';
import { DishesSkeleton } from './dishes-grid/dishes-skeleton';
import styles from './styles.module.css';

type Props = Readonly<{
  searchParams: Promise<{ category?: string }>;
}>;

const DishesGrid = dynamic(
  () => import('./dishes-grid').then((mod) => mod.DishesGrid),
  { ssr: false, loading: () => <DishesSkeleton /> },
);

const DishesSectionContent: FC<Props> = ({ searchParams }) => {
  const { category } = use(searchParams);
  const categoryId = category === firstCategoryId ? null : category ?? null;

  return (
    <>
      <CategoriesSelector searchParams={{ category }} />

      <Suspense
        key={categoryId ?? 'featured'}
        fallback={<DishesSkeleton />}
      >
        <DishesGrid categoryId={categoryId} />
      </Suspense>
    </>
  );
};

export const DishesSection: FC<Props> = ({ searchParams }) => {
  return (
    <section className={styles.dishesSelector}>
      <Suspense fallback={<DishesSkeleton />}>
        <DishesSectionContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
};
