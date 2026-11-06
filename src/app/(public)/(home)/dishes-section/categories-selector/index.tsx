'use client';

import type { FC } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  CategoriesSelector as SharedCategoriesSelector,
} from '@/app/(public)/(components)/categories-selector';
import { firstCategoryId } from '@/shared/data/categories';

type Props = Readonly<{
  searchParams: { category?: string };
}>;

export const CategoriesSelector: FC<Props> = ({ searchParams }) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentCategory = searchParams.category ?? null;
  const selectedCategoryId = currentCategory ?? firstCategoryId;

  const handleSelect = (categoryId: string) => {
    const isFeatured = categoryId === firstCategoryId;
    const nextCategory =
      isFeatured || categoryId === selectedCategoryId
        ? null
        : categoryId;

    if (nextCategory === currentCategory) return;

    const params = new URLSearchParams();

    if (nextCategory) params.set('category', nextCategory);

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <SharedCategoriesSelector
      selectedCategoryId={selectedCategoryId}
      onSelect={handleSelect}
    />
  );
};
