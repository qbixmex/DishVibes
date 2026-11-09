import { Suspense, type FC } from 'react';
import type { Metadata } from 'next';
import { OrdersView } from './(components)/orders-view';
import { SuggestionsGrid } from './(components)/suggestions-grid';
import { SuggestionsSkeleton } from './(components)/suggestions-grid/suggestions-skeleton';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Your order | Dish Vibes',
  description: 'Review your order and check out when you are ready.',
};

const OrdersPage: FC = () => {
  return (
    <div className={styles.page}>
      <OrdersView
        suggestionsSlot={
          <Suspense fallback={<SuggestionsSkeleton />}>
            <SuggestionsGrid />
          </Suspense>
        }
      />
    </div>
  );
};

export default OrdersPage;
