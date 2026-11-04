import { render, screen } from '@testing-library/react';
import HomePage from '@/app/(public)/page';

vi.mock('@/app/(public)/(home)/hero-section', () => ({
  HeroSection: () => <div data-testid="hero-section" />,
}));

vi.mock('@/app/(public)/(home)/dishes-section', () => ({
  DishesSection: () => <div data-testid="dishes-section" />,
}));

vi.mock('@/app/(public)/(home)/features-section', () => ({
  FeaturesSection: () => <div data-testid="features-section" />,
}));

vi.mock('@/app/(public)/(home)/booking-section', () => ({
  BookingSection: () => <div data-testid="booking-section" />,
}));

vi.mock('@/app/(public)/(home)/faq-section', () => ({
  FAQSection: () => <div data-testid="faq-section" />,
}));

describe('Test on <HomePage /> component', () => {
  const renderComponent = () => {
    render(<HomePage />);
  };

  test('Should render correctly', () => {
    renderComponent();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/dish vibes/i);
  });

  test('Should contains <HeroSection /> component', () => {
    renderComponent();
    expect(screen.getByTestId('hero-section')).toBeVisible();
  });

  test('Should contains <DishesSection />', () => {
    renderComponent();
    expect(screen.getByTestId('dishes-section')).toBeVisible();
  });

  test('Should contains <FeaturesSection />', () => {
    renderComponent();
    expect(screen.getByTestId('features-section')).toBeVisible();
  });

  test('Should contains <BookingSection />', () => {
    renderComponent();
    expect(screen.getByTestId('booking-section')).toBeVisible();
  });

  test('Should contains <FAQSection />', () => {
    renderComponent();
    expect(screen.getByTestId('faq-section')).toBeVisible();
  });
});
