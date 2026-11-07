'use client';

import { toast } from 'sonner';
import { MAX_QUANTITY, MIN_QUANTITY } from '@/shared/constants/order';
import type { OrderLine } from '@/shared/interfaces/order.interface';
import { useOrderStore } from '@/shared/stores/order-store';

type Params = Readonly<{
  line: OrderLine;
}>;

export const useDishItem = ({ line }: Params) => {
  const incrementLine = useOrderStore((state) => state.incrementLine);
  const decrementLine = useOrderStore((state) => state.decrementLine);
  const setLineQuantity = useOrderStore((state) => state.setLineQuantity);
  const removeLine = useOrderStore((state) => state.removeLine);
  const addLine = useOrderStore((state) => state.addLine);

  const { lineId, dish, quantity, specialInstructions } = line;

  const handleIncrement = () => {
    incrementLine(lineId);
  };

  const handleDecrement = () => {
    decrementLine(lineId);
  };

  const handleQuantityChange = (value: string) => {
    const parsedQuantity = Number.parseInt(value, 10);

    setLineQuantity(
      lineId,
      Number.isNaN(parsedQuantity) ? MIN_QUANTITY : parsedQuantity,
    );
  };

  const handleDeleteOrder = () => {
    removeLine(lineId);

    toast('Removed from your order', {
      description: dish.name,
      action: {
        label: 'Undo',
        onClick: () => {
          addLine({
            dishId: dish.id,
            quantity,
            specialInstructions,
            dish,
          });
        },
      },
    });
  };

  return {
    canDecrement: quantity > MIN_QUANTITY,
    canIncrement: quantity < MAX_QUANTITY,
    handleIncrement,
    handleDecrement,
    handleQuantityChange,
    handleDeleteOrder,
  };
};
