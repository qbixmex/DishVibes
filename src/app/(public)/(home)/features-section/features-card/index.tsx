import type { FC } from "react";
import type { Feature } from "../data";
import styles from "./styles.module.css";

type Props = Readonly<{
  feature: Feature;
  step: number;
}>;

export const FeaturesCard: FC<Props> = ({ feature, step }) => {
  const { heading, description, icon: Icon } = feature;
  
  return (
    <section className={styles.card}>
      <div className={styles.cardInfo}>
        <h3 className={styles.cardHeading}>{heading}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
      <figure>
        <Icon className={styles.cardIcon} aria-hidden="true" />
      </figure>
      <span className={styles.cardStep} role="status">
        <span className="visually-hidden">Preparation step </span>{step}
      </span>
    </section>
  );
};
