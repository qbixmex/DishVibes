import { ThemeSwitcher } from '@/app/(public)/(components)/theme-switcher';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mocks = vi.hoisted(() => ({ setTheme: vi.fn() }));

vi.mock('next-themes', () => ({
  useTheme: () => ({ setTheme: mocks.setTheme }),
}));

describe('Test on <ThemeSwitcher /> component', () => {
  test('Should render the theme button', () => {
    render(<ThemeSwitcher />);

    expect(
      screen.getByRole('button', { name: /theme/i }),
    ).toBeInTheDocument();
  });

  test.each([
    ['Light', 'light'],
    ['Dark', 'dark'],
    ['System', 'system'],
  ])(
    'Should set the "%s" theme when the option is clicked',
    async (label, theme) => {
      const user = userEvent.setup();
      render(<ThemeSwitcher />);

      await user.click(screen.getByRole('button', { name: /theme/i }));
      await user.click(await screen.findByRole('menuitem', { name: label }));

      expect(mocks.setTheme).toHaveBeenLastCalledWith(theme);
    },
  );

  test('Should render the three theme options', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    await user.click(screen.getByRole('button', { name: /theme/i }));

    expect(await screen.findAllByRole('menuitem')).toHaveLength(3);
  });
});
