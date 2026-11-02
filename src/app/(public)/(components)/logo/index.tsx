'use client';

import type { FC } from "react";
import { Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import styles from "./styles.module.css";

export const Logo: FC = () => {
  const path = usePathname();

  return (
    <Link href="/" title="Go to home">
      <div className={styles.logo}>
        <figure>
          <Utensils aria-hidden="true" />
        </figure>
        <span className={cn({ [styles.currentPath]: path === '/' })}>
          Dish Vibes
        </span>
      </div>
    </Link>
  );
};
