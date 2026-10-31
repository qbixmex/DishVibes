import { DishesSkeleton } from '@/app/(public)/(home)/dishes-section/dishes-grid/dishes-skeleton';
import { render } from '@testing-library/react';

describe('Test on <DishesSkeleton /> component', () => {
  test('Should render four dish skeletons', () => {
    const { container } = render(<DishesSkeleton />);

    expect(container.firstElementChild?.children).toHaveLength(4);
  });

  test('Should render the pulse animation container', () => {
    const { container } = render(<DishesSkeleton />);

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
