import { DishSkeleton } from "./dish-item/dish-skeleton";

export const DishesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-8 lg:gap-10 animate-pulse">
      {Array.from({ length: 4 }).map((_, col) => (
        <DishSkeleton key={`col-${col + 1}`} />
      ))}
    </div>
  );
};
