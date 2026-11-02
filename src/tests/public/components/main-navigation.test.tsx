import { render, screen } from '@testing-library/react';
import { MainNavigation } from '@/app/(public)/(components)/main-navigation/main-navigation';
import { links } from '@/app/(public)/(components)/main-navigation/data';

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

    const linkElements = screen.getAllByRole('link');
    expect(linkElements).toHaveLength(links.length);

    for (const link of links) {
      const linkElement = screen.getByRole('link', { name: link.label });
      expect(linkElement).toHaveAttribute('href', link.url);
    }
  });

  test('Should highlight the link that matches the current path', () => {
    mocks.pathname = '/about';

    render(<MainNavigation />);

    const aboutLink = screen.getByRole('link', { name: 'About' });
    const menuLink = screen.getByRole('link', { name: 'Menu' });

    expect(aboutLink).toHaveClass('text-primary');
    expect(menuLink).not.toHaveClass('text-primary');
  });

  test('Should not highlight any link when the path does not match', () => {
    mocks.pathname = '/lorem';

    render(<MainNavigation />);

    for (const link of links) {
      const linkElement = screen.getByRole('link', { name: link.label });
      expect(linkElement).not.toHaveClass('text-primary');
    }
  });
});
