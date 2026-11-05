'use client';

import type { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { useDishOrderForm } from './use-dish-order-form';
import { DishQuantity } from './form-fields/dish-quantity';
import { SpecialInstructions } from './form-fields/special-instructions';
import styles from './styles.module.css';

type Props = Readonly<{
  price: number;
}>;

export const DishOrderForm: FC<Props> = ({ price }) => {
  const { form, onSubmit, total } = useDishOrderForm(price);

  return (
    <FormProvider {...form}>
      <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
        <SpecialInstructions />
        <Separator />
        <div className={styles.checkout}>
          <div className={styles.checkoutLeft}>
            <DishQuantity />
          </div>
          <div className={styles.checkoutRight}>
            <div className={styles.total}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalPrice}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
        <Button type="submit" size="lg" className={styles.addToOrderButton}>
          Add to order
        </Button>
      </form>
    </FormProvider>
  );
};
