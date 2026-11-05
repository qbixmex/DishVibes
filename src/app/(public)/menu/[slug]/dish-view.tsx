import type { FC } from 'react';
import { notFound } from 'next/navigation';
import { getDishBySlug } from './(actions)/get-dish-by-slug';
import { DishDetails } from './dish-details';
import type { Dish } from '@/shared/interfaces/dish.interface';

type Props = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export const DishView: FC<Props> = async ({ params }) => {
  const slug = (await params).slug;
  const result = await getDishBySlug(slug);

  if (!result.success) {
    notFound();
  }

  const dish = result.dish as Dish;

  return (
    <DishDetails dish={dish} />
  );
};
