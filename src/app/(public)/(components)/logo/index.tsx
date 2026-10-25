import type { FC } from "react";
import { Utensils } from "lucide-react";
import Link from "next/link";
import styles from "./styles.module.css";

export const Logo: FC = () => {
  return (
    <Link href="/" title="Go to home">
      <div className={styles.logo}>
        <figure>
          <Utensils />
        </figure>
        <span>Dish Vibes</span>
      </div>
    </Link>
  );
};
