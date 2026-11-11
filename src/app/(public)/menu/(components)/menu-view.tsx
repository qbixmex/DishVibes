import type { FC } from "react";
import { Suspense } from "react";
import { connection } from "next/server";
import { MenuCategoriesSelector } from "./categories-selector";
import { MenuDishes } from "./menu-dishes";
import { DishesSkeleton } from "./dishes-grid/dishes-skeleton";

type Props = Readonly<{
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    limit?: string;
  }>;
}>;

export const MenuView: FC<Props> = async ({ searchParams }) => {
  await connection();
  const resolvedSearchParams = await searchParams;
  const key = [
    resolvedSearchParams.category ?? "",
    resolvedSearchParams.search ?? "",
    resolvedSearchParams.page ?? "",
    resolvedSearchParams.limit ?? "",
  ].join("|");

  return (
    <>
      <MenuCategoriesSelector searchParams={resolvedSearchParams} />

      <Suspense key={key} fallback={<DishesSkeleton quantity={8} />}>
        <MenuDishes searchParams={resolvedSearchParams} />
      </Suspense>
    </>
  );
};
