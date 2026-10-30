'use client';

import type { FC } from "react";
import { links } from "./data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import styles from "./styles.module.css";

export const MainNavigation: FC = () => {
  const path = usePathname();

  return (
    <div className={styles.mainNavigation}>
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.url}
          className={cn({ 'text-primary': link.url === path })}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};
