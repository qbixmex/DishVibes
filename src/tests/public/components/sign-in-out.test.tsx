import { isInaccessible, render, screen, waitFor } from '@testing-library/react';
import { SignInOut } from '@/app/(public)/(components)/sign-in-out';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';

describe('Test on <SignInOut /> component', () => {
  const renderComponent = () => {
    render(<SignInOut />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /go to authentication/i });
    const loginIcon = () => screen.queryByTestId('login-icon');
    const logoutIcon = () => screen.queryByTestId('logout-icon');
    const tooltip = () => screen.queryByTestId('tooltip-content');

    return { user, link, loginIcon, logoutIcon, tooltip };
  };

  test('Should render a login link when the user is not authenticated', async () => {
    const { link, loginIcon, logoutIcon } = renderComponent();

    expect(link).toHaveAttribute('href', '#');

    await waitFor(() => {
      expect(loginIcon()).toBeVisible();
      expect(logoutIcon()).not.toBeInTheDocument();
    });

    expect(isInaccessible(loginIcon()!)).toBe(true);
  });

  test('Should show the login tooltip on hover', async () => {
    const { user, link, logoutIcon, tooltip } = renderComponent();

    await user.hover(link);

    await waitFor(() => {
      expect(tooltip()).toBeVisible();
      expect(tooltip()).toHaveTextContent(/login/i);
      expect(logoutIcon()).not.toBeInTheDocument();
    });
  });
});
