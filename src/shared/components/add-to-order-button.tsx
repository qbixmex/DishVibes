'use client';

import type { ComponentProps, FC, ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { toOrderDishSnapshot, useOrderStore } from '@/shared/stores/order-store';

type Props = Omit<ComponentProps<typeof Button>, 'onClick' | 'children'> &
  Readonly<{
    dish: Dish;
    children: ReactNode;
  }>;

/**
 * Adds one unit of a dish to the order. Shared by the menu cards and the
 * orders page suggestions so the behaviour is the same everywhere.
 */
export const AddToOrderButton: FC<Props> = ({ dish, children, ...props }) => {
  const addLine = useOrderStore((state) => state.addLine);

  const handleClick = () => {
    addLine({
      dishId: dish.id,
      quantity: 1,
      specialInstructions: '',
      dish: toOrderDishSnapshot(dish),
    });

    toast.success(`${dish.name} added to your order`);
  };

  return (
    <Button {...props} type="button" onClick={handleClick}>
      <Plus aria-hidden="true" />
      {children}
    </Button>
  );
};
