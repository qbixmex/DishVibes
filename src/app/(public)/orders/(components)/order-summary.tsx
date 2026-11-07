'use client';

import { useState, type FC, type FormEvent } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn, formatCurrency } from '@/lib/utils';
import { useOrderTotals } from '@/shared/stores/order-selectors';
import { useOrderStore } from '@/shared/stores/order-store';
import styles from '../styles.module.css';

export const OrderSummary: FC = () => {
  const [promoCode, setPromoCode] = useState('');

  const linesCount = useOrderStore((state) => state.lines.length);
  const hydrated = useOrderStore((state) => state.hydrated);
  const appliedPromo = useOrderStore((state) => state.promoCode);
  const applyPromo = useOrderStore((state) => state.applyPromo);
  const removePromo = useOrderStore((state) => state.removePromo);

  const { subtotal, discount, tax, total } = useOrderTotals();
  const canCheckout = hydrated && linesCount > 0;

  const handlePromoSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedCode = promoCode.trim().toUpperCase();

    if (normalizedCode === '') return;

    if (applyPromo(normalizedCode)) {
      toast.success(`Promo code ${normalizedCode} applied`);
      setPromoCode('');

      return;
    }

    toast.error('That promo code is not valid');
  };

  return (
    <section className={styles.summaryCard}>
      <h2 className={styles.summaryHeading}>Order Summary</h2>

      <div className={styles.summaryRows}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className={cn(styles.summaryRow, styles.discountRow)}>
            <span>Discount ({appliedPromo})</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className={styles.summaryRow}>
          <span>Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>

        <Separator />

        <div className={cn(styles.summaryRow, styles.totalRow)}>
          <span>Total</span>
          <span data-testid="order-total">{formatCurrency(total)}</span>
        </div>
      </div>

      <form className={styles.promoForm} onSubmit={handlePromoSubmit}>
        <label htmlFor="promoCode" className="visually-hidden">
          Promo code
        </label>
        <Input
          id="promoCode"
          name="promoCode"
          value={promoCode}
          placeholder="Promo code"
          autoComplete="off"
          onChange={(event) => setPromoCode(event.target.value)}
          className={styles.promoInput}
        />
        <Button type="submit" variant="outline" className={styles.promoButton}>
          apply
        </Button>
      </form>

      {appliedPromo && (
        <button
          type="button"
          className={styles.removePromoButton}
          onClick={removePromo}
        >
          <X aria-hidden="true" />
          Remove {appliedPromo}
        </button>
      )}

      <div className={styles.summaryCheckout}>
        {canCheckout ? (
          <Link
            href="/checkout"
            className={buttonVariants({
              size: 'lg',
              className: styles.checkoutButton,
            })}
          >
            Checkout
          </Link>
        ) : (
          <Button size="lg" className={styles.checkoutButton} disabled>
            Checkout
          </Button>
        )}

        <Link href="/menu" className={styles.menuLink}>
          Check Menu
        </Link>
      </div>
    </section>
  );
};
