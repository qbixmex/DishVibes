'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { Triangle, Circle } from 'lucide-react';
import { AddToOrderButton } from '@/shared/components/add-to-order-button';
import { cn, formatCurrency } from '@/lib/utils';
import type { Dish } from '@/shared/interfaces/dish.interface';
import styles from '../styles.module.css';

type Props = Readonly<{
  suggestions: Dish[];
}>;

export const OrderSuggestions: FC<Props> = ({ suggestions }) => {
  return (
    <section className={styles.suggestions} aria-labelledby="order-suggestions-title">
      <header className={styles.suggestionsHeader}>
        <h2 id="order-suggestions-title" className={styles.suggestionsTitle}>
          You might also like
        </h2>
        <p className={styles.suggestionsSubtitle}>Add a drink to your meal</p>
      </header>

      <ul className={styles.suggestionsGrid}>
        {suggestions.map((dish) => (
          <li key={dish.id} className={cn(styles.suggestionCard)}>
            {dish.imageUrl === '' ? (
              <figure className={styles.suggestionPlaceholder} aria-hidden="true">
                <Triangle />
                <Circle />
              </figure>
            ) : (
              <Image
                src={dish.imageUrl}
                alt=""
                width={96}
                height={96}
                className={styles.suggestionImage}
              />
            )}

            <div className={styles.suggestionDetails}>
              <h3 className={styles.suggestionName}>{dish.name}</h3>
              <p className={styles.suggestionDescription}>{dish.description}</p>
              <p className={styles.suggestionPrice}>{formatCurrency(dish.price)}</p>
            </div>

            <AddToOrderButton
              dish={dish}
              size="sm"
              className={styles.suggestionButton}
              aria-label={`Add ${dish.name} to your order`}
            >
              Add
            </AddToOrderButton>
          </li>
        ))}
      </ul>
    </section>
  );
};
