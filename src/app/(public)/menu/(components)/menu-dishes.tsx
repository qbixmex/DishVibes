import type { FC } from "react";
import { getDishesAction } from "../(actions)/get-dishes.action";
import { DishesGrid } from "./dishes-grid";
import Pagination from "@/shared/components/pagination";

type Props = Readonly<{
  searchParams: {
    category?: string;
    page?: string;
    limit?: string;
  };
}>;

export const MenuDishes: FC<Props> = async ({ searchParams }) => {
  const { category, page, limit } = searchParams;
  const result = await getDishesAction({
    category,
    page: Number(page ?? 1),
    take: Number(limit ?? 8),
  });

  return (
    <>
      <DishesGrid dishes={result.dishes} />

      {result.pagination && result.pagination.totalPages > 1 && (
        <div className="flex justify-center my-10">
          <Pagination totalPages={result.pagination.totalPages} />
        </div>
      )}
    </>
  );
};
