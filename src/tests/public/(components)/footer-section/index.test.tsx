import { FooterSection } from '@/app/(public)/(components)/footer-section';
import { render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Test on <FooterSection /> component', () => {
  test('Should render the brand, slogan and contact data', () => {
    render(<FooterSection />);

    expect(screen.getByRole('link', { name: /dish vibes/i })).toHaveAttribute(
      'href',
      '/',
    );
    expect(
      screen.getByText('Delicious taste for you mouth.'),
    ).toBeInTheDocument();
    expect(screen.getByText('+1 232-555-1232')).toBeInTheDocument();
    expect(screen.getByText('contact@dishvibes.com')).toBeInTheDocument();
  });

  test('Should render the footer headings', () => {
    render(<FooterSection />);

    for (const heading of ['Order', 'About Us', 'Info', 'Social Media']) {
      expect(screen.getByText(heading)).toBeInTheDocument();
    }
  });

  test('Should render the order links', () => {
    render(<FooterSection />);

    for (const label of ['Menu', 'Offers', 'Location', 'Track Order']) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        '#',
      );
    }
  });

  test('Should render the about us links', () => {
    render(<FooterSection />);

    for (const label of ['Our History', 'Frequent Questions', 'Contact']) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        '#',
      );
    }
  });

  test('Should render the info links', () => {
    render(<FooterSection />);

    for (const label of ['Delivery', 'Privacy', 'Terms']) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        '#',
      );
    }
  });

  test('Should render the social media links', () => {
    render(<FooterSection />);

    for (const label of ['Facebook', 'Twitter X', 'Instagram', 'TikTok']) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        '#',
      );
    }
  });

  test('Should render the copyright notice', () => {
    render(<FooterSection />);

    expect(
      screen.getByText('© 2026 Food Studio. All rights reserved.'),
    ).toBeInTheDocument();
  });
});
