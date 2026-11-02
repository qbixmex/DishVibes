import { isInaccessible, render, screen } from '@testing-library/react';
import { Logo } from '@/app/(public)/(components)/logo';
import styles from '@/app/(public)/(components)/logo/styles.module.css';

const mocks = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}));

describe('Test on <Logo /> component', () => {
  beforeEach(() => {
    mocks.pathname = '/';
  });

  const renderComponent = () => {
    render(<Logo />);

    const link = screen.getByRole('link');
    const icon = link.querySelector('svg');
    const siteTitle = screen.getByText('Dish Vibes');

    return { link, icon, siteTitle };
  };

  test('Should render a decorative logo icon', () => {
    const { icon } = renderComponent();

    expect(icon).toBeVisible();
    expect(isInaccessible(icon!)).toBe(true);
  });

  test('Should render a link to the home page with the brand name', () => {
    const { link } = renderComponent();

    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveAttribute('title', 'Go to home');
    expect(link).toHaveTextContent('Dish Vibes');
  });

  test('Should mark the brand as current on the home route', () => {
    const { siteTitle } = renderComponent();

    expect(siteTitle).toHaveTextContent(/dish vibes/i);
    expect(siteTitle).toHaveClass(styles.currentPath!);
  });

  test('Should not mark the brand as current on another route', () => {
    mocks.pathname = '/menu';

    const { siteTitle } = renderComponent();

    expect(siteTitle).not.toHaveClass(styles.currentPath!);
  });
});
