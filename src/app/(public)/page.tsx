import type { FC } from "react";
import { HeroSection } from "./(home)/hero-section";
import { DishesSection } from "./(home)/dishes-section";
import { FeaturesSection } from "./(home)/features-section";
import { FeedbackSection } from "./(home)/feedback-section";
import { FAQSection } from "./(home)/faq-section";

const HomePage: FC = () => {
  return (
    <section className="mb-10">
      <h1 className="visually-hidden">Dish Vibes</h1>
      <HeroSection />
      <DishesSection />
      <FeaturesSection />
      <FAQSection />
      <FeedbackSection />
    </section>
  );
};

export default HomePage;
