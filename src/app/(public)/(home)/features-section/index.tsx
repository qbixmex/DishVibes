import styles from "./styles.module.css";
import { FeaturesCard } from "./features-card";
import { features } from "./data";

export const FeaturesSection = () => {
  return (
    <section className={styles.features}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Place Your <span>Order</span></h2>
        <p className={styles.description}>
          We are ready to prepare your delicious meal.
        </p>
      </div>

      <div className={styles.cardsWrapper}>
        {features.map((feature, index) => (
          <FeaturesCard
            key={feature.id}
            feature={feature}
            step={index + 1}
          />
        ))}
      </div>
    </section>
  );
};
