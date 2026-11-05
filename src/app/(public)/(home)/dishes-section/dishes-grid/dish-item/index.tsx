import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Dish } from '@/shared/interfaces/dish.interface';
import { Triangle, Circle } from 'lucide-react';
import styles from './styles.module.css';

type Props = Readonly<{ dish: Dish; }>;

export const DishItem: FC<Props> = ({ dish }) => {
  const dishHref = `/menu/${dish.slug}`;

  return (
    <Card>
      <CardHeader>
        <Link
          href={dishHref}
          className={styles.dishImageLink}
          tabIndex={-1}
          aria-hidden="true"
        >
          {dish.imageUrl === '' ? (
            <figure
              className={styles.dishPlaceholderImage}
              data-testid="image-placeholder"
            >
              <Triangle aria-hidden="true" />
              <Circle aria-hidden="true" />
            </figure>
          ) : (
            <Image
              src={dish.imageUrl}
              width={1280}
              height={720}
              alt={`${dish.name} pizza`}
              className={styles.dishImage}
            />
          ) }
        </Link>
      </CardHeader>
      <CardContent>
        <h3 className={styles.dishName}>
          <Link href={dishHref} className={styles.dishNameLink}>
            {
              (dish.name.length > 26)
                ? dish.name.slice(0, 26) + ' ...'
                : dish.name
            }
          </Link>
        </h3>
        <p className={styles.dishDescription}>
          {dish.description.slice(0, 68) + ' ...'}
        </p>
      </CardContent>
      <CardFooter>
        <div className={styles.footer}>
          <div>
            <p className={styles.dishPrice} role="status">
              ${dish.price}
            </p>
          </div>
          <div>
            <Button className={styles.dishCtaButton}>
              add order
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
