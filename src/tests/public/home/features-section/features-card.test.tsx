import { Leaf } from 'lucide-react';
import { FeaturesCard } from '@/app/(public)/(home)/features-section/features-card';
import type { Feature } from '@/app/(public)/(home)/features-section/data';
import { isInaccessible, render, screen } from '@testing-library/react';

const feature: Feature = {
  id: 'feature-id',
  heading: 'Add to order',
  description: 'Select your items then add to order.',
  icon: Leaf,
};

describe('Test on <FeaturesCard /> component', () => {
  test('Should render the heading and description', () => {
    render(<FeaturesCard feature={feature} step={1} />);

    const heading = screen.getByRole('heading', { level: 3 });
    const description = screen.getByText(feature.description);

    expect(heading).toHaveTextContent(/add to order/i);
    expect(description).toBeVisible();
  });

  test('Should render a decorative feature icon', () => {
    const { container } = render(<FeaturesCard feature={feature} step={1} />);

    const icon = container.querySelector('figure svg');

    expect(icon).toBeVisible();
    expect(isInaccessible(icon!)).toBe(true);
  });

  test('Should render the step number with its context', () => {
    render(<FeaturesCard feature={feature} step={2} />);

    const step = screen.getByRole('status');

    expect(step).toBeVisible();
    expect(step).toHaveTextContent('Preparation step 2');
  });
});
