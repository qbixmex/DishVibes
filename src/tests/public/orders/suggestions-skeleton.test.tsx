import { SuggestionsSkeleton } from '@/app/(public)/orders/(components)/suggestions-grid/suggestions-skeleton';
import { render, screen } from '@testing-library/react';

describe('Tests on <SuggestionsSkeleton /> component', () => {
  test('Should render three suggestion skeletons', () => {
    const { container } = render(<SuggestionsSkeleton />);

    expect(container.firstElementChild?.children).toHaveLength(3);
  });

  test('Should render five skeleton blocks per suggestion', () => {
    const { container } = render(<SuggestionsSkeleton />);

    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(15);
  });

  test('Should hide the placeholders from assistive technology', () => {
    const { container } = render(<SuggestionsSkeleton />);
    const cards = Array.from(container.firstElementChild?.children ?? []);

    for (const card of cards) {
      expect(card).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('Should describe the loading state for assistive technology', () => {
    render(<SuggestionsSkeleton />);

    const skeleton = screen.getByTestId('suggestions-skeleton');

    expect(skeleton).toBeVisible();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });
});
