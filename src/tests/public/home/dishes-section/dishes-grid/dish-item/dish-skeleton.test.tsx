import { DishSkeleton } from '@/app/(public)/(components)/dish-item/dish-skeleton';
import { render } from '@testing-library/react';

describe('Test on <DishSkeleton /> component', () => {
  test('Should render the placeholder blocks', () => {
    const { container } = render(<DishSkeleton />);

    expect(container.querySelectorAll('.bg-gray-700')).toHaveLength(6);
  });
});
