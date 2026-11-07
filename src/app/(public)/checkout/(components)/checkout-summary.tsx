'use client';

import type { FC } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn, formatCurrency } from '@/lib/utils';
import type { OrderLine } from '@/shared/interfaces/order.interface';
import { useOrderTotals } from '@/shared/stores/order-selectors';
import { useOrderStore } from '@/shared/stores/order-store';
import styles from '../styles.module.css';

type Props = Readonly<{
  lines: OrderLine[];
}>;

export const CheckoutSummary: FC<Props> = ({ lines }) => {
  const promoCode = useOrderStore((state) => state.promoCode);
  const { subtotal, discount, tax, total } = useOrderTotals();

  return (
    <aside className={styles.summaryCard} aria-label="Order summary">
      <h2 className={styles.summaryHeading}>Your order</h2>

      <ul className={styles.summaryList}>
        {lines.map((line) => (
          <li key={line.lineId} className={styles.summaryLine}>
            <span className={styles.summaryQuantity}>{line.quantity}×</span>
            <span className={styles.summaryName}>
              {line.dish.name}
              {line.specialInstructions !== '' && (
                <small className={styles.summaryInstructions}>
                  {line.specialInstructions}
                </small>
              )}
            </span>
            <span className={styles.summaryPrice}>
              {formatCurrency(line.dish.price * line.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <Separator />

      <div className={styles.totals}>
        <div className={styles.totalRow}>
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className={cn(styles.totalRow, styles.discountRow)}>
            <span>Discount ({promoCode})</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className={styles.totalRow}>
          <span>Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>

        <div className={cn(styles.totalRow, styles.grandTotalRow)}>
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </aside>
  );
};
