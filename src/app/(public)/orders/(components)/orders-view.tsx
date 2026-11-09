'use client';

import type { FC, ReactNode } from 'react';
import { useOrderStore } from '@/shared/stores/order-store';
import { EmptyOrder } from './empty-order';
import { OrderItems } from './order-items';
import { OrderItemsSkeleton } from './order-items-skeleton';
import { OrderSummary } from './order-summary';
import styles from '../styles.module.css';

type Props = Readonly<{ suggestionsSlot: ReactNode }>;

export const OrdersView: FC<Props> = ({ suggestionsSlot }) => {
  const lines = useOrderStore((state) => state.lines);
  const hydrated = useOrderStore((state) => state.hydrated);
  const hasLines = lines.length > 0;

  return (
    <article className={styles.ordersView}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Your <span className={styles.titleAccent}>{lines.length === 1 ? 'Order' : 'Orders'}</span>
        </h1>
        <p className={styles.subtitle}>
          Review your order, then submit it when you are ready.
        </p>
      </header>

      <div className={styles.content}>
        <section className={styles.items} aria-label="Order items">
          {!hydrated ? (
            <OrderItemsSkeleton />
          ) : hasLines ? (
            <OrderItems lines={lines} />
          ) : (
            <EmptyOrder />
          )}
        </section>

        <aside className={styles.summary} aria-label="Order summary">
          <OrderSummary />
        </aside>
      </div>

      {suggestionsSlot}
    </article>
  );
};
