import AboutPage from '@/app/(public)/about/page';
import { render, screen } from '@testing-library/react';

describe('Test on <AboutPage /> component', () => {
  const renderComponent = () => {
    render(<AboutPage />);
  };

  test('Should render the main heading', () => {
    renderComponent();

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeVisible();
    expect(heading).toHaveTextContent(/our story/i);
    expect(heading).toHaveTextContent(/dish vibes origins/i);
  });

  test('Should render the story section headings', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /a dream of youth \(1982\)/i,
      }),
    ).toBeVisible();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /pizzas, burgers, and arcade/i,
      }),
    ).toBeVisible();
  });

  test('Should render the story content', () => {
    renderComponent();

    expect(screen.getByText(/our story began in vancouver/i)).toBeVisible();
    expect(
      screen.getByText(/not just to feed people, but to build a haven/i),
    ).toBeVisible();
    expect(
      screen.getByText(/the best pizzas and burgers in town/i),
    ).toBeVisible();
    expect(screen.getByText(/fight space invaders/i)).toBeVisible();
  });

  test('Should render the menu link', () => {
    renderComponent();

    const menuLink = screen.getByRole('link', { name: /explore menu/i });

    expect(menuLink).toBeVisible();
    expect(menuLink).toHaveAttribute('href', '/menu');
  });

  test('Should render the restaurant image', () => {
    renderComponent();

    const image = screen.getByAltText(/dish vibes at eighties/i);
    const src = image.getAttribute('src') as string;
    const parsedUrl = new URL(src, 'http://localhost');
    const originalUrl = parsedUrl.searchParams.get('url') ?? src;

    expect(image).toBeVisible();
    expect(originalUrl).toContain('restaurant-eighties.jpg');
  });
});
