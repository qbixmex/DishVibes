import type { FC } from "react";
import { ConciergeBell } from "lucide-react";
import styles from "./styles.module.css";

export const Orders: FC = () => {
  return (
    <div className={styles.orders}>
      <ConciergeBell aria-hidden="true" />
      <div className={styles.orderQuantity} role="status">
        5<span className="visually-hidden"> orders in cart</span>
      </div>
    </div>
  );
};
