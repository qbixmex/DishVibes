import { isInaccessible, render, screen } from '@testing-library/react';
import { FooterSection } from '@/app/(public)/(components)/footer-section';

vi.mock('@/app/(public)/(components)/logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

const orderLinks = [
  { label: 'Menu', href: '/menu' },
  { label: 'Offers', href: '/offers' },
  { label: 'Location', href: '/location' },
  { label: 'Track Order', href: '/track-order' },
];
const aboutLinks = [
  { label: 'Our History', href: '/about' },
  { label: 'Frequent Questions', href: '#' },
  { label: 'Contact', href: '/contact' },
];
const infoLinks = ['Delivery', 'Privacy', 'Terms'];
const socialLinks = ['Facebook', 'Twitter X', 'Instagram', 'TikTok'];

describe('Test on <FooterSection /> component', () => {
  test('Should render the brand, slogan and contact data', () => {
    const { container } = render(<FooterSection />);

    const logo = screen.getByTestId('logo');
    const slogan = screen.getByText('Delicious taste for you mouth.');
    const phone = screen.getByText('+1 232-555-1232');
    const email = screen.getByText('contact@dishvibes.com');
    const icons = container.querySelectorAll('svg');

    expect(logo).toBeVisible();
    expect(slogan).toBeVisible();
    expect(phone).toBeVisible();
    expect(email).toBeVisible();

    expect(icons).toHaveLength(6);

    for (const icon of icons) {
      expect(isInaccessible(icon)).toBe(true);
    }
  });

  test('Should render the footer headings', () => {
    render(<FooterSection />);

    for (const heading of ['Order', 'About Us', 'Info', 'Social Media']) {
      expect(screen.getByText(heading)).toBeVisible();
    }
  });

  test('Should render the order links', () => {
    render(<FooterSection />);

    for (const { label, href } of orderLinks) {
      const link = screen.getByRole('link', { name: label });

      expect(link).toHaveAttribute('href', href);
    }
  });

  test('Should render the about us links', () => {
    render(<FooterSection />);

    for (const { label, href } of aboutLinks) {
      const link = screen.getByRole('link', { name: label });

      expect(link).toHaveAttribute('href', href);
    }
  });

  test('Should render the info links', () => {
    render(<FooterSection />);

    for (const label of infoLinks) {
      const link = screen.getByRole('link', { name: label });

      expect(link).toHaveAttribute('href', '#');
    }
  });

  test('Should render the social media links', () => {
    render(<FooterSection />);

    for (const label of socialLinks) {
      const link = screen.getByRole('link', { name: label });

      expect(link).toHaveAttribute('href', '#');
    }
  });

  test('Should render the copyright notice', () => {
    render(<FooterSection />);

    const copyright = screen.getByRole('status');

    expect(copyright).toBeVisible();
    expect(copyright).toHaveTextContent(
      '2026 Food Studio. All rights reserved.',
    );
  });
});
