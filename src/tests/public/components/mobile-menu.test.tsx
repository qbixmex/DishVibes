import { isInaccessible, render, screen } from '@testing-library/react';
import { MobileMenu } from '@/app/(public)/(components)/main-navigation/mobile-menu';
import { links } from '@/app/(public)/(components)/main-navigation/data';
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

  const renderComponent = () => {
    render(<MobileMenu />);
    const user = userEvent.setup();
    const triggerButton = screen.getByRole('button', { name: /open menu/i });

    return { user, triggerButton };
  };

  test('Should keep the menu closed initially', () => {
    const { triggerButton } = renderComponent();

    const aboutButton = screen.queryByRole('button', { name: links[1].label });
    const menuIcon = triggerButton.querySelector('svg');

    expect(triggerButton).toBeVisible();
    expect(menuIcon).toBeVisible();
    expect(isInaccessible(menuIcon!)).toBe(true);
    expect(aboutButton).not.toBeInTheDocument();
  });

  test('Should open the menu when the trigger is clicked', async () => {
    const { user, triggerButton } = renderComponent();

    await user.click(triggerButton);

    for (const link of links) {
      expect(screen.getByRole('button', { name: link.label })).toBeVisible();
    }
  });

  test('Should navigate and close the menu when a link is clicked', async () => {
    const { user, triggerButton } = renderComponent();
    await user.click(triggerButton);

    await user.click(screen.getByRole('button', { name: links[0].label }));

    expect(mocks.push).toHaveBeenCalledWith('/menu');
    expect(
      screen.queryByRole('button', { name: links[0].label }),
    ).not.toBeInTheDocument();
  });

  test('Should close the menu with the close button', async () => {
    const { user, triggerButton } = renderComponent();
    await user.click(triggerButton);

    const closeMenu = screen.getByRole('button', { name: /close menu/i });
    const closeIcon = closeMenu.querySelector('svg');

    expect(closeIcon).toBeVisible();
    expect(isInaccessible(closeIcon!)).toBe(true);

    await user.click(closeMenu);

    expect(
      screen.queryByRole('button', { name: links[0].label }),
    ).not.toBeInTheDocument();
  });

  test('Should highlight the link that matches the current path', async () => {
    mocks.pathname = '/menu';
    const { user, triggerButton } = renderComponent();
    await user.click(triggerButton);

    const menuButton = screen.getByRole('button', { name: links[0].label });
    const aboutButton = screen.getByRole('button', { name: links[1].label });

    expect(menuButton).toHaveClass('text-primary');
    expect(aboutButton).not.toHaveClass('text-primary');
  });
});
