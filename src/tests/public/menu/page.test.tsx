import MenuPage from '@/app/(public)/menu/page';
import { render, screen } from '@testing-library/react';

describe('Test on <MenuPage /> component', () => {
  test('Should render its content', () => {
    render(<MenuPage />);

    expect(screen.getByText('Menu Page')).toBeVisible();
  });
});
