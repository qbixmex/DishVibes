import Loading from '@/app/(public)/menu/[slug]/loading';
import { render, screen } from '@testing-library/react';

describe('Tests on the dish page <Loading /> component', () => {
  test('Should render the dish view skeleton', () => {
    render(<Loading />);

    expect(screen.getByTestId('dish-view-skeleton')).toBeVisible();
  });
});
