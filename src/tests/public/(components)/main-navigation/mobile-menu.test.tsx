import { MobileMenu } from '@/app/(public)/(components)/main-navigation/mobile-menu';
import { links } from '@/app/(public)/(components)/main-navigation/data';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mocks = vi.hoisted(() => ({
  pathname: '/',
  push: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({ push: mocks.push }),
}));

describe('Test on <MobileMenu /> component', () => {
  beforeEach(() => {
    mocks.pathname = '/';
  });

  test('Should keep the menu closed initially', () => {
    render(<MobileMenu />);

    expect(
      screen.queryByRole('button', { name: 'About' }),
    ).not.toBeInTheDocument();
  });

  test('Should open the menu when the trigger is clicked', async () => {
    const user = userEvent.setup();

    render(<MobileMenu />);

    await user.click(screen.getByRole('button'));

    for (const link of links) {
      expect(
        screen.getByRole('button', { name: link.label }),
      ).toBeInTheDocument();
    }
  });

  test('Should navigate and close the menu when a link is clicked', async () => {
    const user = userEvent.setup();

    render(<MobileMenu />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button', { name: 'About' }));

    expect(mocks.push).toHaveBeenCalledWith('/about');
    expect(
      screen.queryByRole('button', { name: 'About' }),
    ).not.toBeInTheDocument();
  });

  test('Should close the menu with the close button', async () => {
    const user = userEvent.setup();

    render(<MobileMenu />);

    await user.click(screen.getByRole('button'));

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[buttons.length - 1]);

    expect(
      screen.queryByRole('button', { name: 'About' }),
    ).not.toBeInTheDocument();
  });

  test('Should highlight the link that matches the current path', async () => {
    const user = userEvent.setup();
    mocks.pathname = '/menu';

    render(<MobileMenu />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveClass(
      'text-primary',
    );
    expect(screen.getByRole('button', { name: 'About' })).not.toHaveClass(
      'text-primary',
    );
  });
});
