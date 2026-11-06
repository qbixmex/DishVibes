import type { FC } from "react";
import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import type { Category } from "@/shared/interfaces/category.interface";
import styles from './styles.module.css';

interface CategoryGroup extends Category {
  icon: LucideIcon;
}

type Props = Readonly<{
  category: CategoryGroup;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
}>;

export const CategoryItem: FC<Props> = ({ category, isSelected, onSelect }) => {
  const { icon: Icon } = category;

  return (
    <div
      className={cn(styles.category, 'group')}
      onClick={() => onSelect(category.id)}
    >
      <div
        className={
          cn(
            styles.iconWrapper,
            'group-hover:bg-primary',
            { [styles.selectedCategory]: isSelected },
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
            { 'text-orange-500': isSelected },
          )
        }
      >
        {category.name}
      </p>
    </div>
  );
};
