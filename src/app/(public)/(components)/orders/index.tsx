'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { ConciergeBell } from 'lucide-react';
import { PUBLIC_ROUTES } from '@/shared/constants/public.routes';
import { useOrderCount } from '@/shared/stores/order-selectors';
import { useOrderStore } from '@/shared/stores/order-store';
import styles from './styles.module.css';

export const Orders: FC = () => {
  const count = useOrderCount();
  const hydrated = useOrderStore((state) => state.hydrated);
  const hasOrders = hydrated && count > 0;

  return (
    <Link
      href={PUBLIC_ROUTES.ORDERS}
      className={styles.orders}
      aria-label="Go to your orders"
      title="Go to your orders"
    >
      <ConciergeBell aria-hidden="true" />

      {hasOrders && (
        <div className={styles.orderQuantity} role="status">
          {count}
          <span className="visually-hidden">
            {count === 1 ? ' order in cart' : ' orders in cart'}
          </span>
        </div>
      )}
    </Link>
  );
};
