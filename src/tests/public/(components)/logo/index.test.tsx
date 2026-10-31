import { Logo } from '@/app/(public)/(components)/logo';
import styles from '@/app/(public)/(components)/logo/styles.module.css';
import { render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}));

describe('Test on <Logo /> component', () => {
  beforeEach(() => {
    mocks.pathname = '/';
  });

  test('Should render a link to the home page with the brand name', () => {
    render(<Logo />);

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveAttribute('title', 'Go to home');
    expect(link).toHaveTextContent('Dish Vibes');
  });

  test('Should mark the brand as current on the home route', () => {
    render(<Logo />);

    expect(screen.getByText('Dish Vibes')).toHaveClass(styles.currentPath!);
  });

  test('Should not mark the brand as current on another route', () => {
    mocks.pathname = '/menu';

    render(<Logo />);

    expect(screen.getByText('Dish Vibes')).not.toHaveClass(
      styles.currentPath!,
    );
  });
});
