'use client';

import type { FC } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  CategoriesSelector as SharedCategoriesSelector,
} from '@/app/(public)/(components)/categories-selector';
import { resolveCategory } from '@/shared/data/categories';
import styles from './styles.module.css';

type Props = Readonly<{
  searchParams: {
    category?: string;
    search?: string;
    page?: string;
    limit?: string;
  };
}>;

export const MenuCategoriesSelector: FC<Props> = ({ searchParams }) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentCategory = resolveCategory(searchParams.category)?.id ?? null;

  const handleSelect = (categoryId: string) => {
    const nextCategory = categoryId === currentCategory ? null : categoryId;
    const params = new URLSearchParams();

    if (nextCategory) {
      const category = resolveCategory(nextCategory);

      params.set('category', category?.slug ?? nextCategory);
    }
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
