import { DishViewSkeleton } from '@/app/(public)/menu/[slug]/dish-view-skeleton';
import { render, screen } from '@testing-library/react';

describe('Tests on <DishViewSkeleton /> component', () => {
  const renderComponent = () => {
    render(<DishViewSkeleton />);

    return {
      skeleton: screen.getByTestId('dish-view-skeleton'),
    };
  };

  test('Should announce that the dish is loading', () => {
    const { skeleton } = renderComponent();

    expect(skeleton).toBeVisible();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Loading dish details')).toBeInTheDocument();
  });

  test('Should render skeleton blocks for the image, the details and the form', () => {
    const { skeleton } = renderComponent();

    const blocks = skeleton.querySelectorAll('[data-slot="skeleton"]');

    expect(blocks.length).toBeGreaterThanOrEqual(8);
  });
});
