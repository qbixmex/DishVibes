import type { FC } from 'react';
import type { OrderLine } from '@/shared/interfaces/order.interface';
import { DishItem } from './dish-item';
import styles from '../styles.module.css';

type Props = Readonly<{
  lines: OrderLine[];
}>;

export const OrderItems: FC<Props> = ({ lines }) => {
  return (
    <ul className={styles.itemsList}>
      {lines.map((line) => (
        <li key={line.lineId} className={styles.itemsListItem}>
          <DishItem line={line} />
        </li>
      ))}
    </ul>
  );
};
