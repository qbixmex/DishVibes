'use client';

import type { FC } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  CategoriesSelector as SharedCategoriesSelector,
} from '@/app/(public)/(components)/categories-selector';
import styles from './styles.module.css';

type Props = Readonly<{
  searchParams: {
    category?: string;
    page?: string;
    limit?: string;
  };
}>;

export const MenuCategoriesSelector: FC<Props> = ({ searchParams }) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentCategory = searchParams.category ?? null;

  const handleSelect = (categoryId: string) => {
    const nextCategory = categoryId === currentCategory ? null : categoryId;
    const params = new URLSearchParams();

    if (nextCategory) params.set('category', nextCategory);
    if (searchParams.limit) params.set('limit', searchParams.limit);

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className={styles.selector}>
      <SharedCategoriesSelector
        selectedCategoryId={currentCategory}
        onSelect={handleSelect}
      />
    </div>
  );
};
