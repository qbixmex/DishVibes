import type { FC } from 'react';
import type { Metadata } from 'next';
import { CheckoutView } from './(components)/checkout-view';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Checkout | Dish Vibes',
  description: 'Confirm your details and place your order.',
};

const CheckoutPage: FC = () => {
  return (
    <div className={styles.page}>
      <CheckoutView />
    </div>
  );
};

export default CheckoutPage;
