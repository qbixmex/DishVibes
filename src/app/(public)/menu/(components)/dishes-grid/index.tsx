import type { FC } from 'react';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { DishItem } from '@/app/(public)/(components)/dish-item';
import styles from './styles.module.css';

type Props = Readonly<{ dishes: Dish[]; }>;

export const DishesGrid: FC<Props> = ({ dishes }) => {
  return (
    <div className={styles.dishesGrid}>
      {dishes.map((dish) => (
        <DishItem key={dish.id} dish={dish} />
      ))}
    </div>
  );
};
