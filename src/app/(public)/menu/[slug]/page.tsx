import type { FC } from 'react';
import { Suspense } from 'react';
import { getDishSlugs } from './(actions)/get-dish-by-slug';
import { DishView } from './dish-view';
import { DishViewSkeleton } from './dish-view-skeleton';

type Props = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export const generateStaticParams = async () => {
  const slugs = await getDishSlugs();

  return slugs.map((slug) => ({ slug }));
};

const DishPage: FC<Props> = ({ params }) => {
  return (
    <Suspense fallback={<DishViewSkeleton />}>
      <DishView params={params} />
    </Suspense>
  );
};

export default DishPage;
