'use client';

import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UtensilsCrossed } from 'lucide-react';
import { getCategoryName } from '@/shared/data/categories';
import { formatCurrency } from '@/lib/utils';
import type { Dish } from '@/shared/interfaces/dish.interface';
import styles from './styles.module.css';

type Props = Readonly<{
  dish: Dish;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  onSelect: () => void;
}>;

export const SearchResultItem: FC<Props> = ({
  dish,
  index,
  isActive,
  onActivate,
  onSelect,
}) => {
  const categoryName = getCategoryName(dish.categoryId);

  return (
    <li
      role="presentation"
      className={styles.resultItem}
      data-active={isActive ? 'true' : undefined}
    >
      <Link
        id={`search-dish-option-${index}`}
        role="option"
        aria-selected={isActive}
        href={`/menu/${dish.slug}`}
        className={styles.resultLink}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onClick={onSelect}
      >
        <span className={styles.thumbnail}>
          {dish.imageUrl ? (
            <Image
              src={dish.imageUrl}
              width={96}
              height={96}
              className={styles.thumbnailImage}
              alt={`${dish.name} dish`}
            />
          ) : (
            <UtensilsCrossed
              aria-hidden="true"
              className={styles.thumbnailFallback}
            />
          )}
        </span>

        <span className={styles.resultInfo}>
          <span className={styles.resultName}>{dish.name}</span>
          {categoryName && (
            <span className={styles.resultCategory}>{categoryName}</span>
          )}
        </span>

        <span className={styles.resultPrice}>{formatCurrency(dish.price)}</span>
      </Link>
    </li>
  );
};
