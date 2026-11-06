'use client';

import { use, type FC } from 'react';
import { DishItem } from '../../../(components)/dish-item';
import { getHomeDishes } from '../../actions/get-home-dishes';
import styles from './styles.module.css';

type Props = Readonly<{ categoryId: string | null; }>;

export const DishesGrid: FC<Props> = ({ categoryId }) => {
  const dishes = use(getHomeDishes({ categoryId, limit: 4 }));

  return (
    <div>
      <h2 className={styles.heading}>Main Dishes</h2>

      <div className={styles.dishesGrid}>
        {dishes.map((dish) => (
          <DishItem key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
};
