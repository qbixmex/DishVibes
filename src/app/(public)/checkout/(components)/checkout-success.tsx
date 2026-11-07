import type { FC } from 'react';
import Link from 'next/link';
import { CircleCheck } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import styles from '../styles.module.css';

type Props = Readonly<{
  orderNumber: string;
}>;

export const CheckoutSuccess: FC<Props> = ({ orderNumber }) => {
  return (
    <section className={styles.success} data-testid="checkout-success">
      <CircleCheck aria-hidden="true" className={styles.successIcon} />
      <h1 className={styles.title}>Order placed</h1>
      <p className={styles.successMessage}>
        Thanks! Your order <strong>{orderNumber}</strong> is being prepared.
      </p>

      <div className={styles.successActions}>
        <Link href="/orders" className={buttonVariants({ size: 'lg' })}>
          View your orders
        </Link>
        <Link href="/menu" className={styles.secondaryLink}>
          Back to the menu
        </Link>
      </div>
    </section>
  );
};
