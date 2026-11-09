import ContactPage from '@/app/(public)/contact/page';
import { render, screen } from '@testing-library/react';
import { CONTACT_INFO } from '@/shared/data/contact';

vi.mock('@/app/(public)/contact/(components)/location-map', () => ({
  LocationMap: () => <div data-testid="location-map" />,
}));

describe('Test on <ContactPage /> component', () => {
  test('Should render the page heading and subtitle', () => {
    render(<ContactPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /contact us/i }),
    ).toBeVisible();
    const subtitle = screen.getByText(
      /Have a question, a comment, or a special request\?/,
    );

    expect(subtitle).toBeVisible();
    expect(subtitle).toHaveTextContent(
      'We will respond to you as soon as possible.',
    );
  });

  test('Should render the contact information section', () => {
    render(<ContactPage />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /contact information/i,
      }),
    ).toBeVisible();
    expect(screen.getByText(CONTACT_INFO.address)).toBeVisible();
    expect(screen.getByText(CONTACT_INFO.phone)).toBeVisible();
    expect(screen.getByText(CONTACT_INFO.email)).toBeVisible();
  });

  test('Should render the contact form', () => {
    render(<ContactPage />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /send us a message/i,
      }),
    ).toBeVisible();
    expect(screen.getByLabelText(/full name/i)).toBeVisible();
    expect(screen.getByLabelText(/email/i)).toBeVisible();
    expect(screen.getByLabelText(/phone/i)).toBeVisible();
    expect(screen.getByLabelText(/^message$/i)).toBeVisible();
    expect(
      screen.getByRole('button', { name: /send message/i }),
    ).toBeVisible();
  });

  test('Should render the map section', () => {
    render(<ContactPage />);

    expect(screen.getByTestId('location-map')).toBeVisible();
  });
});
