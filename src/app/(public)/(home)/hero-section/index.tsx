import type { FC } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import styles from "./styles.module.css";
import Link from "next/link";

export const HeroSection: FC = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroInformation}>
        <div className={styles.heroHeading}>
          <span>Great</span>
          <span>Meals</span>
        </div>
        <div className={styles.heroButtons}>
          <Link href="#" className={styles.ctaOrder}>Order Now <ArrowRight /></Link>
          <Link href="#" className={styles.ctaMenu}>Explore menu</Link>
        </div>
      </div>
      <figure className={styles.heroGraphic}>
        <Image
          src="/images/hamburgers/beef-hamburger-french-fries-coca-cola.webp"
          width={1280}
          height={720}
          alt="Beef hamburger with french fries and coca cola soda"
          className={styles.heroImage}
          loading="eager"
        />
      </figure>
    </section>
  );
};
