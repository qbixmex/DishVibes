import { Leaf } from 'lucide-react';
import { FeaturesCard } from '@/app/(public)/(home)/features-section/features-card';
import type { Feature } from '@/app/(public)/(home)/features-section/data';
import { render, screen } from '@testing-library/react';

const feature: Feature = {
  id: 'feature-id',
  heading: 'Add to order',
  description: 'Select your items then add to order.',
  icon: Leaf,
};

describe('Test on <FeaturesCard /> component', () => {
  test('Should render the heading and description', () => {
    render(<FeaturesCard feature={feature} step={1} />);

    expect(
      screen.getByRole('heading', { level: 3 }),
    ).toHaveTextContent('Add to order');
    expect(screen.getByText(feature.description)).toBeInTheDocument();
  });

  test('Should render the step number', () => {
    render(<FeaturesCard feature={feature} step={2} />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('Should render the feature icon', () => {
    const { container } = render(<FeaturesCard feature={feature} step={1} />);

    expect(container.querySelector('.lucide-leaf')).toBeInTheDocument();
  });
});
