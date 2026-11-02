import LocationPage from '@/app/(public)/location/page';
import { render, screen } from '@testing-library/react';

describe('Test on <LocationPage /> component', () => {
  test('Should render its content', () => {
    render(<LocationPage />);

    expect(screen.getByText('Location Page')).toBeVisible();
  });
});
