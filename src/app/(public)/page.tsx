import type { FC } from "react";
import { HeroSection } from "./(home)/hero-section";
import { DishesSection } from "./(home)/dishes-section";

const HomePage: FC = () => {
  return (
    <section className="mb-10">
      <HeroSection />
      <DishesSection />
    </section>
  );
};

export default HomePage;
