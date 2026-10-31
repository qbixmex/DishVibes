import { MainNavigation } from '@/app/(public)/(components)/main-navigation';
import { links } from '@/app/(public)/(components)/main-navigation/data';
import { render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}));

describe('Test on <MainNavigation /> component', () => {
  beforeEach(() => {
    mocks.pathname = '/';
  });

  test('Should render one link per navigation item', () => {
    render(<MainNavigation />);

    expect(screen.getAllByRole('link')).toHaveLength(links.length);

    for (const link of links) {
      expect(screen.getByRole('link', { name: link.label })).toHaveAttribute(
        'href',
        link.url,
      );
    }
  });

  test('Should highlight the link that matches the current path', () => {
    mocks.pathname = '/about';

    render(<MainNavigation />);

    expect(screen.getByRole('link', { name: 'About' })).toHaveClass(
      'text-primary',
    );
    expect(screen.getByRole('link', { name: 'Menu' })).not.toHaveClass(
      'text-primary',
    );
  });

  test('Should not highlight any link when the path does not match', () => {
    mocks.pathname = '/not-a-route';

    render(<MainNavigation />);

    for (const link of links) {
      expect(screen.getByRole('link', { name: link.label })).not.toHaveClass(
        'text-primary',
      );
    }
  });
});
