import type { FC } from "react";
import styles from "./styles.module.css";
import { ConciergeBell } from "lucide-react";

export const Orders: FC = () => {
  return (
    <div className={styles.orders}>
      <ConciergeBell />
      <div className={styles.orderQuantity}>5</div>
    </div>
  );
};
