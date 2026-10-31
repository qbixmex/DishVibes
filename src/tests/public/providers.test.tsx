import type { ReactNode } from 'react';
import { Providers } from '@/app/(public)/providers';
import { render, screen } from '@testing-library/react';

const themeProviderProps = vi.hoisted(() => ({
  current: {} as Record<string, unknown>,
}));

vi.mock('next-themes', () => ({
  ThemeProvider: (props: Record<string, unknown> & { children?: ReactNode }) => {
    themeProviderProps.current = props;

    return <div data-testid="theme-provider">{props.children}</div>;
  },
}));

vi.mock('sonner', () => ({
  Toaster: (props: {
    position?: string;
    richColors?: boolean;
    toastOptions?: { style?: Record<string, unknown> };
  }) => (
    <div
      data-testid="toaster"
      data-position={props.position}
      data-rich-colors={String(props.richColors)}
      data-toast-width={String(props.toastOptions?.style?.width)}
    />
  ),
}));

describe('Test on <Providers /> component', () => {
  const renderComponent = () =>
    render(
      <Providers>
        <p>app content</p>
      </Providers>,
    );

  test('Should render the children inside the theme provider', () => {
    renderComponent();

    expect(screen.getByTestId('theme-provider')).toHaveTextContent(
      'app content',
    );
  });

  test('Should configure the theme provider', () => {
    renderComponent();

    expect(themeProviderProps.current).toMatchObject({
      attribute: 'class',
      defaultTheme: 'system',
      enableSystem: true,
      disableTransitionOnChange: true,
    });
  });

  test('Should configure the toaster', () => {
    renderComponent();

    const toaster = screen.getByTestId('toaster');

    expect(toaster).toHaveAttribute('data-position', 'top-right');
    expect(toaster).toHaveAttribute('data-rich-colors', 'true');
    expect(toaster).toHaveAttribute('data-toast-width', '400');
  });
});
