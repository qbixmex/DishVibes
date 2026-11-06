import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";

const AboutPage: FC = () => {
  return (
    <article className={styles.history}>
      <header>
        <h1>Our Story: <span>Dish Vibes Origins</span></h1>
      </header>

      <div className={styles.layout}>
        <div className={styles.columnOne}>
          <div className={styles.content}>
            <h2>A Dream of Youth (1982)</h2>

            <p>Our story began in Vancouver, BC, when two enthusiastic young brothers decided to turn their passion for food and pop culture into something real. With more energy than budget, but with a clear vision, they opened the doors to a unique concept.</p>

            <p>The goal was not just to feed people, but to build a haven where the community could disconnect from the world and connect with each other</p>

            <h2>Pizzas, Burgers, and Arcade</h2>

            <p>From day one, the formula was simple yet foolproof: the best pizzas and burgers in town, prepared with fresh ingredients and a homemade touch that became a local legend.</p>

            <p>Meanwhile you can fight Space Invaders or eating pills with Pacman or other fantastic tiles in a cozy space and get 80s vibes atmosphere. The flickering lights of the arcade machines of the era provided the soundtrack for the afternoons, creating the perfect gathering spot for friends and families looking to have a good time.</p>
          </div>

          <div className={styles.linkContainer}>
            <Link
              href="/menu"
              className={styles.menuLink}
            >
              Explore Menu
            </Link>
          </div>
        </div>
        <div className={styles.columnTwo}>
          <Image
            src="/images/restaurant/restaurant-eighties.jpg"
            height={0}
            width={0}
            alt="Dish Vibes at eighties"
            className={styles.contentImage}
          />
        </div>
      </div>
    </article>
  );
};

export default AboutPage;
