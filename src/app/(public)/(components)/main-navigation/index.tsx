import type { FC } from "react";
import { links } from "./data";
import Link from "next/link";
import styles from "./styles.module.css";

export const MainNavigation: FC = () => {
  return (
    <div className={styles.mainNavigation}>
      {links.map((link) => (
        <Link key={link.id} href={link.url}>
          { link.label }
        </Link>
      ))}
    </div>
  );
};
