import type { FC } from "react";
import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import type { Category } from "@/shared/interfaces/category.interface";
import { useDishCategoryStore } from "@/store/use-dish-category-store";
import styles from './styles.module.css';

interface CategoryGroup extends Category {
  icon: LucideIcon;
}

type Props = Readonly<{ category: CategoryGroup; }>;

export const CategoryItem: FC<Props> = ({ category }) => {
  const { icon: Icon } = category;
  const {
    categoryId,
    addCategoryId,
    removeCategoryId,
  } = useDishCategoryStore((state) => state);

  const selectedCategory =
    (categoryId === null && category.name.toLowerCase() === "featured") ||
    (categoryId === category.id);

  return (
    <div
      className={cn(styles.category, 'group')}
      onClick={() => {
        if (category.name.toLowerCase() !== 'featured' && (!categoryId || categoryId !== category.id)) {
          addCategoryId(category.id);
        }
        if (category.name.toLowerCase() === 'featured' || categoryId === category.id) {
          removeCategoryId();
        }
      }}
    >
      <div
        className={
          cn(
            styles.iconWrapper,
            'group-hover:bg-primary',
            { [styles.selectedCategory]: selectedCategory },
          )
        }
      >
        <Icon aria-hidden="true" />
      </div>
      <p
        className={
          cn(
            styles.categoryName,
            'group-hover:text-orange-500',
            { 'text-orange-500': selectedCategory },
          )
        }
      >
        {category.name}
      </p>
    </div>
  );
};
