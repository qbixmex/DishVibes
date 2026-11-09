'use client';

import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Circle, Minus, NotebookPen, Plus, Trash, Triangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { MAX_QUANTITY, MIN_QUANTITY } from '@/shared/constants/order';
import type { OrderLine } from '@/shared/interfaces/order.interface';
import { useDishItem } from './use-dish-item';
import styles from './styles.module.css';

type Props = Readonly<{
  line: OrderLine;
}>;

export const DishItem: FC<Props> = ({ line }) => {
  const { dish, quantity, specialInstructions } = line;

  const {
    canDecrement,
    canIncrement,
    handleIncrement,
    handleDecrement,
    handleQuantityChange,
    handleDeleteOrder,
  } = useDishItem({ line });

  const dishHref = `/menu/${dish.slug}`;

  return (
    <article className={styles.dishItem}>
      <div className={styles.dishMedia}>
        {dish.imageUrl === '' ? (
          <figure
            className={styles.dishPlaceholderImage}
            data-testid="image-placeholder"
          >
            <Triangle aria-hidden="true" />
            <Circle aria-hidden="true" />
          </figure>
        ) : (
          <Image
            src={dish.imageUrl}
            alt={`${dish.name} dish`}
            width={240}
            height={240}
            className={styles.dishImage}
          />
        )}
      </div>

      <div className={styles.dishDetails}>
        <h2 className={styles.dishName}>
          <Link href={dishHref} className={styles.dishLink}>
            {dish.name}
          </Link>
        </h2>

        <p className={styles.dishDescription}>{dish.description}</p>

        {specialInstructions !== '' && (
          <p className={styles.dishInstructions}>
            <NotebookPen aria-hidden="true" />
            {specialInstructions}
          </p>
        )}

        <p className={styles.dishUnitPrice}>
          {formatCurrency(dish.price)}{' '}
          <span>unit price</span>
        </p>
      </div>

      <div className={styles.dishActions}>
        <div className={styles.dishActionsRow}>
          <div className={styles.stepper}>
            <div>
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                onClick={handleDecrement}
                disabled={!canDecrement}
                aria-label={`Decrease quantity of ${dish.name}`}
              >
                <Minus aria-hidden="true" />
              </Button>
            </div>

            <input
              type="number"
              inputMode="numeric"
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              value={quantity}
              onChange={(event) => handleQuantityChange(event.target.value)}
              aria-label={`Quantity of ${dish.name}`}
              className={styles.quantityInput}
            />

            <div>
              <Button
                type="button"
                onClick={handleIncrement}
                disabled={!canIncrement}
                size="icon-lg"
                variant="ghost"
                aria-label={`Increase quantity of ${dish.name}`}
              >
                <Plus aria-hidden="true" />
              </Button>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleDeleteOrder}
            aria-label={`Remove ${dish.name} from order`}
            className={styles.removeButton}
          >
            <Trash aria-hidden="true" />
          </Button>
        </div>

        <div className={styles.dishActionsRow}>
          <p className={styles.dishTotal}>
            <span className="visually-hidden">Line total </span>
            {formatCurrency(dish.price * quantity)}{' '}
            <span>total</span>
          </p>
        </div>
      </div>
    </article>
  );
};
