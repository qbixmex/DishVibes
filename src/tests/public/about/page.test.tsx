import AboutPage from '@/app/(public)/about/page';
import { render, screen } from '@testing-library/react';

describe('Test on <AboutPage /> component', () => {
  test('Should render its content', () => {
    render(<AboutPage />);

    expect(screen.getByText('About Page')).toBeInTheDocument();
  });
});
