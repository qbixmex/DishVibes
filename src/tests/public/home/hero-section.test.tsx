import { isInaccessible, render, screen } from '@testing-library/react';
import { HeroSection } from '@/app/(public)/(home)/hero-section';

describe('Test on <HeroSection /> component', () => {
  const renderComponent = () => {
    render(<HeroSection />);
  };

  test('Should render correctly', () => {
    renderComponent();

    const title = screen.getByRole('heading', { level: 2 });

    expect(title).toBeVisible();
    expect(title).toHaveTextContent(/great meals/i);
  });

  test('Should render order link with a decorative icon', () => {
    renderComponent();

    const orderLink = screen.getByRole('link', { name: /order now/i });
    const icon = orderLink.querySelector('svg');

    expect(orderLink).toBeVisible();
    expect(orderLink).toHaveAttribute('href', '#');
    expect(icon).toBeVisible();
    expect(isInaccessible(icon!)).toBe(true);
  });

  test('Should render menu link', () => {
    renderComponent();

    const menuLink = screen.getByRole('link', { name: /explore menu/i });

    expect(menuLink).toBeVisible();
    expect(menuLink).toHaveAttribute('href', '#');
  });

  test('Should render a hero image', () => {
    renderComponent();

    const heroImage = screen.getByAltText(/beef hamburger/i);
    const src = heroImage.getAttribute('src') as string;
    const parsedUrl = new URL(src, 'http://localhost');
    const originalUrl = parsedUrl.searchParams.get('url');

    expect(originalUrl).toContain(
      'beef-hamburger-french-fries-coca-cola.webp',
    );
  });
});
