import { SignInOut } from '@/app/(public)/(components)/sign-in-out';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Test on <SignInOut /> component', () => {
  test('Should render a login link when the user is not authenticated', () => {
    const { container } = render(<SignInOut />);

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '#');
    expect(container.querySelector('.lucide-log-in')).toBeInTheDocument();
    expect(container.querySelector('.lucide-log-out')).not.toBeInTheDocument();
  });

  test('Should show the login tooltip on hover', async () => {
    const user = userEvent.setup();
    render(<SignInOut />);

    await user.hover(screen.getByRole('link'));

    const tooltip = await screen.findByText('login');

    expect(tooltip).toHaveAttribute('data-slot', 'tooltip-content');
    expect(screen.queryByText('logout')).not.toBeInTheDocument();
  });
});
