import { HeroSection } from "@/app/(public)/(home)/hero-section";
import { render, screen } from "@testing-library/react";


describe('Test on <HeroSection /> component', () => {
  const renderComponent = () => {
    render(<HeroSection />);
  };

  test('Should render correctly', () => {
    renderComponent();
  });

  test('Should have a title', () => {
    renderComponent();
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent(/great meals/i);
  });

  test('Should render order button call to action', () => {
    renderComponent();
    const ctaButton = screen.getByRole('button');
    expect(ctaButton).toHaveTextContent(/order now/i);
  });

  test('Should render menu link', () => {
    renderComponent();
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent(/explore menu/i);
    expect(link).toHaveAttribute('href', '#');
  });

  test('Should render a hero image', () => {
    renderComponent();

    const heroImage = screen.getByAltText('Beef hamburger with french fries and coca cola soda');
    const src = heroImage.getAttribute('src') as string;
    const parsedUrl = new URL(src, 'http://localhost');
    const originalUrl = parsedUrl.searchParams.get('url');

    expect(originalUrl).toContain(
      'beef-hamburger-french-fries-coca-cola.webp',
    );
  });
});