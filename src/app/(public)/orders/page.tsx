import type { FC } from 'react';
import type { Metadata } from 'next';
import { drinks } from '@/shared/data/drinks';
import { OrdersView } from './(components)/orders-view';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Your order | Dish Vibes',
  description: 'Review your order and check out when you are ready.',
};

const OrdersPage: FC = () => {
  const suggestions = drinks.slice(0, 3);

  return (
    <div className={styles.page}>
      <OrdersView suggestions={suggestions} />
    </div>
  );
};

export default OrdersPage;
