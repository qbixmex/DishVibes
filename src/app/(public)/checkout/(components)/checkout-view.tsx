'use client';

import { useState, type FC } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrderStore } from '@/shared/stores/order-store';
import { CheckoutForm } from './checkout-form';
import { CheckoutSuccess } from './checkout-success';
import { CheckoutSummary } from './checkout-summary';
import styles from '../styles.module.css';

const CheckoutSkeleton: FC = () => {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <Skeleton className={styles.skeletonTitle} />
      <div className={styles.columns}>
        <div className={styles.skeletonForm}>
          <Skeleton className={styles.skeletonField} />
          <Skeleton className={styles.skeletonField} />
          <Skeleton className={styles.skeletonField} />
          <Skeleton className={styles.skeletonField} />
        </div>
        <Skeleton className={styles.skeletonSummary} />
      </div>
    </div>
  );
};

export const CheckoutView: FC = () => {
  const lines = useOrderStore((state) => state.lines);
  const hydrated = useOrderStore((state) => state.hydrated);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  if (!hydrated) {
    return <CheckoutSkeleton />;
  }

  if (orderNumber) {
    return <CheckoutSuccess orderNumber={orderNumber} />;
  }

  if (lines.length === 0) {
    return (
      <section className={styles.empty}>
        <h1 className={styles.title}>Checkout</h1>
        <p className={styles.emptyMessage}>
          Your order is empty. Add something from the menu before checking out.
        </p>
        <Link href="/menu" className={buttonVariants({ size: 'lg' })}>
          Explore the menu
        </Link>
      </section>
    );
  }

  return (
    <article className={styles.checkout}>
      <header className={styles.header}>
        <Link href="/orders" className={styles.backLink}>
          <ArrowLeft aria-hidden="true" />
          Back to your order
        </Link>
        <h1 className={styles.title}>Checkout</h1>
        <p className={styles.subtitle}>
          Tell us where this order is going and place it.
        </p>
      </header>

      <div className={styles.columns}>
        <CheckoutForm lines={lines} onSuccess={setOrderNumber} />
        <CheckoutSummary lines={lines} />
      </div>
    </article>
  );
};
