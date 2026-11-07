import type { FC } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import styles from '../styles.module.css';

export const EmptyOrder: FC = () => {
  return (
    <div className={styles.emptyState} data-testid="empty-order">
      <ShoppingBag aria-hidden="true" className={styles.emptyIcon} />
      <h2 className={styles.emptyTitle}>Your order is empty</h2>
      <p className={styles.emptyDescription}>
        Browse the menu and add your favourite dishes to get started.
      </p>
      <Link href="/menu" className={buttonVariants({ size: 'lg' })}>
        Explore the menu
      </Link>
    </div>
  );
};
