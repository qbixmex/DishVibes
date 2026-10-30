import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { Triangle, Circle } from 'lucide-react';
import styles from './styles.module.css';

type Props = Readonly<{ dish: Dish; }>;

export const DishItem: FC<Props> = ({ dish }) => {
  return (
    <Card>
      <CardHeader>
        {dish.imageUrl === '' ? (
          <div className={styles.dishPlaceholderImage}>
            <Triangle />
            <Circle />
          </div>
        ) : (
          <Image
            src={dish.imageUrl}
            width={1280}
            height={720}
            alt={`${dish.name} pizza`}
            className={styles.dishImage}
          />
        ) }
      </CardHeader>
      <CardContent>
        <h3 className={styles.dishName}>
          {
            (dish.name.length > 26)
              ? dish.name.slice(0, 26) + ' ...'
              : dish.name
          }
        </h3>
        <p className={styles.dishDescription}>
          {dish.description.slice(0, 68) + ' ...'}
        </p>
      </CardContent>
      <CardFooter>
        <div className={styles.footer}>
          <div>
            <p className={styles.dishPrice}>${dish.price}</p>
          </div>
          <div>
            <Button className={styles.dishCtaButton}>Add to cart</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
