import ContactPage from '@/app/(public)/contact/page';
import { render, screen } from '@testing-library/react';

describe('Test on <ContactPage /> component', () => {
  test('Should render its content', () => {
    render(<ContactPage />);

    expect(screen.getByText('Contact Page')).toBeVisible();
  });
});
