import type { FC } from "react";
import Link from "next/link";
import { getDishesAction } from "../(actions)/get-dishes.action";
import { DishesGrid } from "./dishes-grid";
import Pagination from "@/shared/components/pagination";

type Props = Readonly<{
  searchParams: {
    category?: string;
    search?: string;
    page?: string;
    limit?: string;
  };
}>;

export const MenuDishes: FC<Props> = async ({ searchParams }) => {
  const { category, search, page, limit } = searchParams;
  const result = await getDishesAction({
    category,
    search,
    page: Number(page ?? 1),
    take: Number(limit ?? 8),
  });

  const clearParams = new URLSearchParams();

  if (category) clearParams.set('category', category);
  if (limit) clearParams.set('limit', limit);

  const clearQuery = clearParams.toString();
  const clearHref = clearQuery ? `/menu?${clearQuery}` : '/menu';

  return (
    <>
      {search && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Results for <span className="font-semibold text-foreground">“{search}”</span>
          </p>
          <Link
            href={clearHref}
            className="text-sm underline underline-offset-4 hover:text-primary"
          >
            Clear search
          </Link>
        </div>
      )}

      <DishesGrid dishes={result.dishes} />

      {result.dishes.length === 0 && (
        <p role="status" className="py-10 text-center text-muted-foreground">
          {result.error ?? 'No dishes found'}
        </p>
      )}

      {result.pagination && result.pagination.totalPages > 1 && (
        <div className="flex justify-center my-10">
          <Pagination totalPages={result.pagination.totalPages} />
        </div>
      )}
    </>
  );
};
