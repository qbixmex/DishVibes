import type { FC } from "react";
import { Suspense } from "react";
import { MenuView } from "./(components)/menu-view";
import { DishesSkeleton } from "./(components)/dishes-grid/dishes-skeleton";

type Props = Readonly<{
  searchParams: Promise<{
    category?: string;
    page?: string;
    limit?: string;
  }>;
}>;

const MenuPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense fallback={<DishesSkeleton />}>
      <MenuView searchParams={searchParams} />
    </Suspense>
  );
};

export default MenuPage;
