import { FeaturesSection } from '@/app/(public)/(home)/features-section';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/(public)/(home)/features-section/features-card', () => ({
    FeaturesCard: () => <div data-testid="features-card" />,
  }),
);

describe('Test on <FeaturesSection /> component', () => {
  test('Should render the heading and description', () => {
    render(<FeaturesSection />);
    const heading = screen.getByRole('heading', { level: 2 });
    const slogan = screen.getByText(/we are ready/i);

    expect(heading).toHaveTextContent(/place your order/i);
    expect(slogan).toBeVisible();
  });

  test('Should render one card per feature', () => {
    render(<FeaturesSection />);

    const featuresCard = screen.getAllByTestId('features-card');

    expect(featuresCard).toHaveLength(3);

  });
});
