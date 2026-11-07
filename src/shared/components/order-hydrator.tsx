'use client';

import { useEffect, type FC } from 'react';
import { ORDER_STORAGE_KEY } from '@/shared/constants/order';
import { useOrderStore } from '@/shared/stores/order-store';

/**
 * Rehydrates the persisted order after the first client render and keeps
 * multiple tabs in sync through the `storage` event.
 */
export const OrderHydrator: FC = () => {
  useEffect(() => {
    void useOrderStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== ORDER_STORAGE_KEY) return;

      void useOrderStore.persist.rehydrate();
    };

    window.addEventListener('storage', onStorage);

    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return null;
};
