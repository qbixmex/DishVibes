import { DishesSkeleton } from '@/app/(public)/menu/(components)/dishes-grid/dishes-skeleton';
import { render, screen } from '@testing-library/react';

describe('Test on <DishesSkeleton /> component', () => {
  test('Should render four dish skeletons', () => {
    const { container } = render(<DishesSkeleton />);

    expect(container.firstElementChild?.children).toHaveLength(4);
  });

  test('Should render the pulse animation container', () => {
    const { container } = render(<DishesSkeleton />);

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('Should render eight dish skeletons when requested', () => {
    const { container } = render(<DishesSkeleton quantity={8} />);

    expect(container.firstElementChild?.children).toHaveLength(8);
  });

  test('Should render two dish skeletons when requested', () => {
    const { container } = render(<DishesSkeleton quantity={2} />);

    expect(container.firstElementChild?.children).toHaveLength(2);
  });

  test('Should render a complete dish skeleton per item', () => {
    const { container } = render(<DishesSkeleton quantity={8} />);
    const items = Array.from(container.firstElementChild?.children ?? []);

    expect(items).toHaveLength(8);

    for (const item of items) {
      expect(item.querySelectorAll('.bg-gray-700')).toHaveLength(6);
    }
  });

  test('Should describe the loading state for assistive technology', () => {
    render(<DishesSkeleton />);

    const skeletonGrid = screen.getByTestId('menu-dishes-skeleton');

    expect(skeletonGrid).toBeVisible();
    expect(skeletonGrid).toHaveAttribute('aria-busy', 'true');
  });
});
