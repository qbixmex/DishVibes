import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Circle, Triangle } from 'lucide-react';
import { categories } from '@/shared/data/categories';
import { formatCurrency } from '@/lib/utils';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { DishOrderForm } from './dish-order-form';
import styles from './styles.module.css';

type Props = Readonly<{
  dish: Dish;
}>;

export const DishDetails: FC<Props> = ({ dish }) => {
  const category = categories.find((category) => category.id === dish.categoryId);

  return (
    <article className={styles.dishDetails}>
      <Link href="/menu" className={styles.backLink}>
        <ArrowLeft aria-hidden="true" />
        Back to menu
      </Link>

      <div className={styles.columns}>
        <figure className={styles.imageWrapper}>
          {dish.imageUrl === '' ? (
            <div
              className={styles.dishPlaceholderImage}
              data-testid="image-placeholder"
            >
              <Triangle aria-hidden="true" />
              <Circle aria-hidden="true" />
            </div>
          ) : (
            <Image
              src={dish.imageUrl}
              alt={`${dish.name} meal`}
              width={1600}
              height={900}
              priority
              className={styles.dishImage}
            />
          )}

          {category && (
            <figcaption className={styles.categoryBadge}>
              {category.name}
            </figcaption>
          )}
        </figure>

        <div className={styles.columnTwo}>
          <header className={styles.header}>
            <h1 className={styles.dishName}>{dish.name}</h1>
            <p className={styles.dishDescription}>{dish.description}</p>
            <p className={styles.dishPrice}>{formatCurrency(dish.price)}</p>
          </header>

          <DishOrderForm price={dish.price} />
        </div>
      </div>
    </article>
  );
};
