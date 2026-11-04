import {
  isInaccessible,
  render,
  screen,
} from '@testing-library/react';
import { Contact } from '@/app/(public)/(home)/booking-section/contact';

describe('Test on <Contact /> component', () => {
  const renderComponent = () => {
    render(<Contact />);
  };

  test('Should render the heading', () => {
    renderComponent();

    const heading = screen.getByRole('heading', {
      level: 2,
      name: /contact information/i,
    });

    expect(heading).toBeVisible();
  });

  test('Should render the phone information', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { level: 3, name: /phone:/i }),
    ).toBeVisible();
    expect(screen.getByText('+1 232-555-1232')).toBeVisible();
  });

  test('Should render the email information', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { level: 3, name: /email:/i }),
    ).toBeVisible();
    expect(screen.getByText('contact@dishvibes.com')).toBeVisible();
  });

  test('Should render the address information', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { level: 3, name: /address:/i }),
    ).toBeVisible();
    expect(
      screen.getByText(
        '900 Ganville Street, Vancouver, British Columbia',
      ),
    ).toBeVisible();
  });

  test('Should render every icon as decorative', () => {
    const { container } = render(<Contact />);

    const icons = container.querySelectorAll('svg');

    expect(icons).toHaveLength(3);

    icons.forEach((icon) => {
      expect(icon).toBeVisible();
      expect(isInaccessible(icon)).toBe(true);
    });
  });
});
