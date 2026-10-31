import { Orders } from '@/app/(public)/(components)/orders';
import { render, screen } from '@testing-library/react';

describe('Test on <Orders /> component', () => {
  test('Should render the bell icon and the orders quantity', () => {
    const { container } = render(<Orders />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(container.querySelector('.lucide-concierge-bell')).toBeInTheDocument();
  });
});
