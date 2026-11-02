import type { FC, ReactNode } from 'react';
import PublicLayout from '@/app/(public)/layout';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/(public)/providers', () => ({
  Providers: ({ children }: { children: ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

vi.mock('@/app/(public)/(components)/logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

vi.mock('@/app/(public)/(components)/main-navigation/main-navigation', () => ({
  MainNavigation: () => <div data-testid="main-navigation" />,
}));

vi.mock('@/app/(public)/(components)/search-dish', () => ({
  SearchDish: () => <div data-testid="search-dish" />,
}));

vi.mock('@/app/(public)/(components)/orders', () => ({
  Orders: () => <div data-testid="orders" />,
}));

vi.mock('@/app/(public)/(components)/sign-in-out', () => ({
  SignInOut: () => <div data-testid="sign-in-out" />,
}));

vi.mock('@/app/(public)/(components)/theme-switcher', () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher" />,
}));

vi.mock('@/app/(public)/(components)/main-navigation/mobile-menu', () => ({
  MobileMenu: () => <div data-testid="mobile-menu" />,
}));

vi.mock('@/app/(public)/(components)/footer-section', () => ({
  FooterSection: () => <div data-testid="footer-section" />,
}));

const Layout = PublicLayout as FC<{ children: ReactNode }>;

describe('Test on <PublicLayout /> component', () => {
  const renderComponent = () =>
    render(
      <Layout>
        <p>page content</p>
      </Layout>,
    );

  test('Should render the page content inside main', () => {
    renderComponent();

    expect(screen.getByRole('main')).toHaveTextContent('page content');
  });

  test('Should wrap the layout with <Providers />', () => {
    renderComponent();

    expect(screen.getByTestId('providers')).toBeVisible();
  });

  test('Should render the header navigation', () => {
    renderComponent();

    expect(screen.getByRole('navigation')).toBeVisible();
  });

  test('Should render the footer', () => {
    renderComponent();

    expect(screen.getByRole('contentinfo')).toBeVisible();
  });

  test.each([
    'logo',
    'main-navigation',
    'search-dish',
    'orders',
    'sign-in-out',
    'theme-switcher',
    'mobile-menu',
  ])('Should render the <%s /> component in the header', (testId) => {
    renderComponent();

    expect(screen.getByTestId(testId)).toBeVisible();
  });

  test('Should render the <footer-section /> component', () => {
    renderComponent();

    expect(screen.getByTestId('footer-section')).toBeVisible();
  });
});
