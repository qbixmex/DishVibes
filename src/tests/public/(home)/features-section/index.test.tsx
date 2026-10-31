import { FeaturesSection } from '@/app/(public)/(home)/features-section';
import { features } from '@/app/(public)/(home)/features-section/data';
import { render, screen } from '@testing-library/react';

describe('Test on <FeaturesSection /> component', () => {
  test('Should render the heading and description', () => {
    render(<FeaturesSection />);

    expect(
      screen.getByRole('heading', { level: 2 }),
    ).toHaveTextContent(/place your order/i);
    expect(
      screen.getByText('We are ready to prepare your delicious meal.'),
    ).toBeInTheDocument();
  });

  test('Should render one card per feature', () => {
    render(<FeaturesSection />);

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(
      features.length,
    );

    features.forEach((feature, index) => {
      expect(
        screen.getByRole('heading', { level: 3, name: feature.heading }),
      ).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
      expect(screen.getByText(String(index + 1))).toBeInTheDocument();
    });
  });
});
