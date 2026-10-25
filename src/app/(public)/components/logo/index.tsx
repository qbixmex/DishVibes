import type { FC } from "react";
import { Utensils } from "lucide-react";
import styles from "./styles.module.css";
import Link from "next/link";

export const Logo: FC = () => {
  return (
    <Link href="/" title="Go to home">
      <div id={styles.logo}>
        <figure>
          <Utensils />
        </figure>
        <span>Dish Vibes</span>
      </div>
    </Link>
  );
};
