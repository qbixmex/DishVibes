import { render, screen } from '@testing-library/react';
import { BookingSection } from '@/app/(public)/(home)/booking-section';

describe('Test on <BookingSection /> component', () => {
  const renderComponent = () => {
    render(<BookingSection />);
  };

  test('Should render the booking form heading', () => {
    renderComponent();

    const heading = screen.getByRole('heading', {
      level: 2,
      name: /make reservation/i,
    });

    expect(heading).toBeVisible();
  });

  test('Should render the contact information heading', () => {
    renderComponent();

    const heading = screen.getByRole('heading', {
      level: 2,
      name: /contact information/i,
    });

    expect(heading).toBeVisible();
  });

  test('Should render every booking form field', () => {
    renderComponent();

    expect(screen.getByLabelText(/name/i)).toBeVisible();
    expect(screen.getByLabelText(/phone/i)).toBeVisible();
    expect(screen.getByLabelText(/number of persons/i)).toBeVisible();
    expect(screen.getByLabelText(/date/i)).toBeVisible();
    expect(screen.getByLabelText(/hour/i)).toBeVisible();
  });

  test('Should render the submit button', () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /book/i });

    expect(submitButton).toBeVisible();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('Should render the contact information', () => {
    renderComponent();

    expect(screen.getByText('+1 232-555-1232')).toBeVisible();
    expect(screen.getByText('contact@dishvibes.com')).toBeVisible();
    expect(
      screen.getByText(
        '900 Ganville Street, Vancouver, British Columbia',
      ),
    ).toBeVisible();
  });
});
